'use client'
import { useEffect, useState, useRef } from 'react'
//import { Editor } from '@tinymce/tinymce-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), { ssr: false })

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
   const [employees, setEmployees] = useState([])  
   const [settings, setSettings] = useState(null)
     const [now, setNow] = useState(null)

const fetchOfficeSettings = async () => {
  const res = await fetch('/api/office_settings')
  const data = await res.json()
  if (data.success) {setSettings(data.settings[0]);console.log("dddddd"+settings);}
  else toast.error('অফিস সেটিংস লোড করতে ব্যর্থ হয়েছে')
}

const fetchEmployees = async () => {
    const res = await fetch('/api/employees')
    const data = await res.json()
    if(data.success) setEmployees(data.employees)
    else toast.error('Failed to load employees')
  }
  const today = new Date().toISOString().substring(0, 10);
   const [form, setForm] = useState({
    id: null,
    type: '',
    applicantName: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    address: '',
    issuedDate: today,
    nid: '',
    ward: '',
    mouza: '',
    post_office: '',
    holding_no: '',
    notes: '',
      letter_count: '',  

  })

  const printRef = useRef()

  // Load all certificates
  const fetchCertificates = async () => {
    const res = await fetch('/api/certificates')
    const data = await res.json()
    if (data.success) setCertificates(data.certificates)
    else toast.error('Failed to load certificates')
  }

   

    
   

  useEffect(() => {
    fetchCertificates()
    fetchEmployees()
    fetchOfficeSettings()
        setNow(new Date().toLocaleDateString())

  }, [])


   
const signer2=employees[1]||   {
    name: ' ',
    designation: 'প্রশাসনিক কর্মকর্তা',
    office1: '১নং রামগড় ইউনিয়ন পরিষদ',
    office2: ' ',
    office3: ' ',
    office4: 'রামগড়, খাগড়াছড়ি',
  }


 const signer = employees[0] || {
    name: ' ',
    designation: 'দায়িত্বপ্রাপ্ত কর্মকর্তা',
    office1: '১নং রামগড় ইউনিয়ন পরিষদ',
    office2: ' ',
    office3: ' ',
    office4: 'রামগড়, খাগড়াছড়ি',
  }

  const designationText = signer.designation === "OFFICER_IN_CHARGE"
  ? 'দায়িত্বপ্রাপ্ত কর্মকর্তা'
  : 'চেয়ারম্যান'

  const designationText2 = signer.designation === "ADMINISTRATIVE_OFFICER"
  ? 'ইউপি প্রশাসনিক কর্মকর্তা'
  : 'ইউপি প্রশাসনিক কর্মকর্তা'
  const resetForm = () => {
    setForm({
      id: null,
      type: '',
      applicantName: '',
      fatherName: '',
      motherName: '',
      birthDate: '',
      address: '',
      issuedDate: today,
      nid: '',
      ward: '',
      mouza: '',
      post_office: '',
      holding_no: '',
      notes: '',
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

     let letter_count = 1 // default

const firstLetterCount = certificates[0]?.letter_count

if (firstLetterCount === null || firstLetterCount === 0 || isNaN(firstLetterCount)) {
  letter_count = parseInt(form.letter_count) || 1
} else {
  letter_count = firstLetterCount + 1
}


  const payload = {
    ...form,
    letter_count: parseInt(letter_count), // include it in payload
  }


    const method = form.id ? 'PATCH' : 'POST'
    const url = form.id ? `/api/certificates?id=${form.id}` : '/api/certificates'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        
      })
      const data = await res.json()
      if (data.success) {
        toast.success(form.id ? 'Updated Successfully' : 'Added Successfully')
        resetForm()
        fetchCertificates()
      } else {
        toast.error('Operation failed')
      }
    } catch {
      toast.error('Error Occurred')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('ডিলিট নিশ্চিত করবেন?')) return
    const res = await fetch(`/api/certificates?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast.success('Deleted Successfully')
      fetchCertificates()
    } else {
      toast.error('Failed to delete')
    }
  }

  const handleEdit = (cert) => {
    setForm({
      id: cert.id,
      type: cert.type,
      applicantName: cert.applicantName,
      fatherName: cert.fatherName || '',
      motherName: cert.motherName || '',
      birthDate: cert.birthDate ? cert.birthDate.substring(0, 10) : '',
      address: cert.address || '',
      issuedDate: cert.issuedDate ? cert.issuedDate.substring(0, 10) : today,
      nid: cert.nid || '',
      ward: cert.ward || '',
      mouza: cert.mouza || '',
      post_office: cert.post_office || '',
      holding_no: cert.holding_no || '',
      notes: cert.notes || '',
    })
  }

   
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(/,/, ''); // এখানে কমা সরানো হয়েছে
};

const handlePrint = async (cert) => {
  const origin = window.location.origin;

  const govtImg = `${origin}/images/govt.png`;
  const unionImg = `${origin}/images/union2.png`;
  const qrImg = `${origin}/images/qr.png`;

  const preloadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = () => resolve(url);
    });
  };

  try {
    await Promise.all([
      preloadImage(govtImg),
      preloadImage(unionImg),
      preloadImage(qrImg)
    ]);
  } catch (error) {
    console.error('Error preloading images:', error);
  }

  const printContents = `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <title>${cert.type || 'Certificate'}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }

        body {
          font-family: 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          margin: 0;
          padding: 0;
          line-height: 1.2;
          background: #f9f9f9;
        }

        .outer-border {
          margin: 15px;
          padding: 7px;
          background: #000;
        }

        .middle-border {
          padding: 12px;
          background: #fff;
        }

        .inner-border {
          padding: 15px;
          border: 1px solid #000;
          border-radius: 3px;
          background: white;
          position: relative;
          box-sizing: border-box;
          min-height: calc(100vh - 160px);
          overflow: hidden;
          z-index: 1;
        }

        .watermark {
          background-image: url('${unionImg}');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 60%;
          opacity: 0.08;
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 0 20px;
          position: relative;
          z-index: 1;
          line-height:0.9;
          font-size:12px;
        }

        .header-logo {
          width: 80px;
          height: auto;
        }

        .header-title {
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          flex: 1;
        }

        hr {
          border: 1px solid #000;
          margin-top: 5px;
          margin-bottom: 10px;
        }

        .top-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1;
        }

        .top-section p {
          margin: 0;
        }

        h2 {
          text-align: center;
          text-decoration: underline;
          margin: 10px 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }

        table tr td {
          padding: 5px 0;
        }

        p {
          z-index: 1;
        }

        .signature-area {
          margin-top: 80px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
          z-index: 1;
        }

        .signature-box {
          text-align: center;
          line-height: 1.1;
        }

        .qr-code {
          width: 80px;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="outer-border">
        <div class="middle-border">
          <div class="inner-border">
            <div class="watermark"></div>

            <div class="header-section">
              <img src="${govtImg}" class="header-logo" alt="Government Logo" />
              <h3 class="header-title">${settings?.notes || ''}</h3>
              <img src="${unionImg}" class="header-logo" alt="Union Logo" />
            </div>

            <hr />

            <div class="top-section">
              <p>স্মারক নং: ${settings?.sarok_no}${settings?.letter_count}</p>
              <p>তারিখ: ${formatDate(cert.issuedDate || new Date())}</p>
            </div>

            <h2>"${cert.type || 'সার্টিফিকেট'}"</h2>

            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;প্রত্যয়ন করা যাচ্ছে যে,</p>

            <table>
  <tr>
    <td style="width: 30%;">নাম</td>
    <td>: ${cert.applicantName}</td>
  </tr>
  <tr>
    <td>পিতার নাম</td>
    <td>: ${cert.fatherName || '-'}</td>
  </tr>
  <tr>
    <td>মাতার নাম</td>
    <td>: ${cert.motherName || '-'}</td>
  </tr>
  <tr>
    <td>জন্ম তারিখ</td>
    <td>: ${cert.birthDate?.substring(0, 10) || '-'}</td>
  </tr>
  <tr>
    <td>গ্রাম</td>
    <td>: ${cert.address || '-'}</td>
  </tr>
  <tr>
    <td>জাতীয় পরিচয়পত্র নম্বর</td>
    <td>: ${cert.nid || '-'}</td>
  </tr>
  <tr>
    <td>ওয়ার্ড</td>
    <td>: ${cert.ward || '-'}</td>
    <td>হোল্ডিং নং</td>
    <td>: ${cert.holding_no || '-'}</td>
  </tr>
   
    
   
  <tr>
    <td>মৌজা</td>
    <td>: ${cert.mouza || '-'}</td>
  </tr>
  <tr>
    <td>ডাকঘর</td>
    <td>: ${cert.post_office || '-'}</td>
  </tr>
</table>


            <p>তিনি উপরোক্ত ঠিকানার একজন স্থায়ী বাসিন্দা এবং ব্যক্তিগতভাবে আমার পরিচিত। 
            আমার জানামতে তিনি জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র বা সমাজ বিরোধী কোনো কার্যকলাপের সঙ্গে জড়িত নন।</p>

            <p style="margin-left:90px;">আমি তাহার সর্বাঙ্গীন মঙ্গল ও উন্নতি কামনা করছি।</p>

            <div class="signature-area">
              <div class="signature-box">
                <p style="margin: 0; width: 200px; padding-top: 5px;">${signer2.name}</p>
                <p>${designationText2}</p>
                <p>${settings?.union_name}</p>
                <p>${settings?.upazila}, ${settings?.district}</p>
              </div>

              <img src="${qrImg}" class="qr-code" alt="QR Code" />

              <div class="signature-box">
                <p style="margin: 0; width: 200px; padding-top: 5px;">${signer.name}</p>
                <p>${designationText}</p>
                <p>${settings?.union_name}</p>
                <p>${settings?.upazila}, ${settings?.district}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const newWin = window.open('', '_blank', 'width=800,height=1000');
  newWin.document.write(printContents);
  newWin.document.close();

  newWin.onload = () => {
    setTimeout(() => {
      newWin.print();
      // newWin.close(); // চাইলে প্রিন্ট শেষে বন্ধ করতে এই লাইন আনকমেন্ট করো
    }, 500);
  };
};

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ইউনিয়ন পরিষদ সকল সনদ</h1>

      <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow mb-8 space-y-4">
        <div>
          <label className="font-semibold">সনদের ধরন</label>
          <select
            required
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">-- সনদের ধরন নির্বাচন করুন --</option>
            <option value="নাগরিক সনদ">নাগরিক সনদ</option>
            <option value="জাতীয়তা সনদ">জাতীয়তা সনদ</option>
            <option value="ওয়ারিশ সনদ">ওয়ারিশ সনদ</option>
            <option value="বার্ষিক আয়ের সনদ">বার্ষিক আয়ের সনদ</option>
            <option value="বিবিধ সনদ">বিবিধ সনদ</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">আবেদনকারীর নাম</label>
          <input
            type="text"
            required
            value={form.applicantName}
            onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="আবেদনকারীর নাম"
          />
        </div>

        <div>
          <label className="font-semibold">পিতার নাম</label>
          <input
            type="text"
            value={form.fatherName}
            onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="পিতার নাম  " required
          />
        </div>

        <div>
          <label className="font-semibold">মাতার নাম</label>
          <input
            type="text"
            value={form.motherName}
            onChange={(e) => setForm({ ...form, motherName: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="মাতার নাম  " required
          />
        </div>

        <div>
          <label className="font-semibold">জন্ম তারিখ</label>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

         <div>
          <label className="font-semibold">জাতীয় পরিচয়পত্রের নম্বর</label>
          <input
            type="text"
            value={form.nid}
            onChange={(e) => setForm({ ...form, nid: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="nid " required
          />
        </div>

         

        {certificates.length === 0 && (
  <div>
    <label className="font-semibold">সনদের নাম্বার (শুধু প্রথমটির জন্য)</label>
    <input
      type="text"
      value={form.letter_count}
      onChange={(e) => setForm({ ...form, letter_count: e.target.value })}
      className="border p-2 rounded w-full"
      placeholder="letter_count "
      required
    />
  </div>
)}




         <div>
          <label className="font-semibold">ওয়ার্ড</label>
          <input
            type="text"
            value={form.ward}
            onChange={(e) => setForm({ ...form, ward: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="ওয়ার্ড " required
          />
        </div>

        <div>
          <label className="font-semibold">হোল্ডিং</label>
          <input
            type="text"
            value={form.holding_no}
            onChange={(e) => setForm({ ...form, holding_no: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="হোল্ডিং " required
          />
        </div>

         <div>
          <label className="font-semibold">মৌজা</label>
          <input
            type="text"
            value={form.mouza}
            onChange={(e) => setForm({ ...form, mouza: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="মৌজা " required
          />
        </div>

         <div>
          <label className="font-semibold">পোস্ট অফিস</label>
          <input
            type="text"
            value={form.post_office}
            onChange={(e) => setForm({ ...form, post_office: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="পোস্ট অফিস " required
          />
        </div>

       

        <div>
          <label className="font-semibold">ঠিকানা</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="ঠিকানা"
            rows={2}
          />
        </div>

        <div>
          <label className="font-semibold">জারি করার তারিখ</label>
          <input
            type="date"
            value={form.issuedDate}
            onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold">নোটস</label>
         <Editor
  apiKey="fg6rfz4onq5dx0irorid2gyjdbh9xdpg01k2kdcqk7594hd2"
  value={form.notes}
  init={{
    height: 200,
    menubar: false,
    directionality: 'ltr',
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'help',
      'wordcount',
    ],
    toolbar:
      'undo redo | formatselect | bold italic underline | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help',
  }}
  onEditorChange={(content) => setForm({ ...form, notes: content })}
/>

        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {form.id ? 'আপডেট করুন' : 'সেভ করুন'}
        </button>

        {form.id && (
          <button
            type="button"
            onClick={() => resetForm()}
            className="w-full mt-2 bg-gray-400 text-white py-2 rounded"
          >
            নতুন ফরম
          </button>
        )}
      </form>

      <div className="bg-white border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">সনদ তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-2">সনদের ধরন</th>
              <th className="border p-2">আবেদনকারীর নাম</th>
              <th className="border p-2">পিতার নাম</th>
              <th className="border p-2">মাতার নাম</th>
              <th className="border p-2">জন্ম তারিখ</th>
              <th className="border p-2">ঠিকানা</th>
              <th className="border p-2">জারি তারিখ</th>
              <th className="border p-2">নোটস</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  কোনো সনদ পাওয়া যায়নি।
                </td>
              </tr>
            )}
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td className="border p-2">{cert.type}</td>
                <td className="border p-2">{cert.applicantName}</td>
                <td className="border p-2">{cert.fatherName || '-'}</td>
                <td className="border p-2">{cert.motherName || '-'}</td>
                <td className="border p-2">{cert.birthDate ? cert.birthDate.substring(0, 10) : '-'}</td>
                <td className="border p-2">{cert.address || '-'}</td>
                <td className="border p-2">{cert.issuedDate ? cert.issuedDate.substring(0, 10) : '-'}</td>
                <td className="border p-2">
                  <div dangerouslySetInnerHTML={{ __html: cert.notes || '-' }} />
                </td>
                <td className="border p-2 space-x-1">
                  <button onClick={() => handleEdit(cert)} className="text-blue-600">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(cert.id)} className="text-red-600">
                    🗑
                  </button>
                  <button onClick={() => handlePrint(cert)} className="text-green-600">
                    🖨️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  )
}
