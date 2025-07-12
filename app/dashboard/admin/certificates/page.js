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
    const method = form.id ? 'PATCH' : 'POST'
    const url = form.id ? `/api/certificates?id=${form.id}` : '/api/certificates'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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

  // Print function
//   const handlePrint = (cert) => {
//     const printContents = `
//       <div style="padding: 30px; font-family: 'SolaimanLipi', sans-serif; line-height: 1.6;  ">
//         <div style="text-align: center; margin-bottom: 20px;">
  
//   <h3 style="margin: 0;">${settings?.notes || ''}</h3>
   
// </div>

//         <h2 style="text-align: center; text-decoration: underline; margin-bottom: 20px;">
//           ${cert.type}
//         </h2>

//         <h4 style="margin-top: 10px;">স্মারক নং:  <span style="margin-left: 370px;">তারিখ:</span></h4>
//         <p><strong>আবেদনকারীর নাম:</strong> ${cert.applicantName}</p>
//         <p><strong>পিতার নাম:</strong> ${cert.fatherName || '-'}</p>
//         <p><strong>মাতার নাম:</strong> ${cert.motherName || '-'}</p>
//         <p><strong>জন্ম তারিখ:</strong> ${cert.birthDate ? cert.birthDate.substring(0,10) : '-'}</p>
//         <p><strong>ঠিকানা:</strong> ${cert.address || '-'}</p>
//         <p>${cert.notes || '-'}</p>

//         <div style="margin-top: 150px; text-align: right;">
//          <div style="text-align: center; margin-left: 350px;">
//             <p style="margin: 0;">${signer.name}</p>
//            <p style="margin: 0;">${designationText}</p>

//             <p style="margin: 0;">${signer.notes}</p>
             
//           </div>
//         </div>
//       </div>
//     `
//     const newWin = window.open('', '', 'width=600,height=700')
//     newWin.document.write(printContents)
//     newWin.document.close()
//     newWin.focus()
//     newWin.print()
//     newWin.close()
//   }
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
const handlePrint = (cert) => {
    const origin = window.location.origin;

  const printContents = `
    <div style="
      padding: 60px;
      font-family: 'SolaimanLipi', sans-serif;
      position: relative;
      background-image: url('/images/govt.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 350px;
      opacity: 1;
    ">
      <div style="text-align: center;">
        <img src="${origin}/images/govt.png" alt="logo" style="position: absolute; top: 60px; left: 60px; width: 60px;">
        <h3 style="margin: 0;">${settings?.notes || ''}</h3>
        <hr style="margin-top: 20px;">
      </div>

      <div style="margin-top: 20px;">
        <p>স্মারক নং: ${settings?.sarok_no || ''}</p>
       <p style="text-align: right;">তারিখ: ${formatDate(cert.issuedDate || new Date())}</p>

      </div>

      <h2 style="text-align: center; text-decoration: underline;">"${cert.type}"</h2>

      <p style="margin-top: 30px;">প্রত্যয়ন করা যাচ্ছে যে,</p>
      <table style="line-height: 2; font-size: 16px;">
        <tr><td>নাম</td><td>: <span style="margin-left:7px;">  ${cert.applicantName}</span></td></tr>
        <tr><td>পিতার নাম</td><td>:<span style="margin-left:7px;"> ${cert.fatherName || '-'}</span></td></tr>
        <tr><td>মাতার নাম</td><td>:<span style="margin-left:7px;"> ${cert.motherName || '-'}</span></td></tr>
        <tr><td>জন্ম তারিখ</td><td>:<span style="margin-left:7px;"> ${cert.birthDate?.substring(0, 10) || '-'}</span></td></tr>
        <tr><td>স্থায়ী ঠিকানা</td><td>:<span style="margin-left:7px;"> ${cert.address || '-'}</span></td></tr>
        <tr><td>জাতীয় পরিচয়পত্র নম্বর</td><td>:<span style="margin-left:7px;"> ${cert.nid || '-'}</span></td></tr>
        <tr><td>ওয়ার্ড</td><td>:<span style="margin-left:7px;"> ${cert.ward || '-'}</span></td> 
         <td>হোল্ডিং নং:</td><td>:<span style="margin-left:7px;"> ${cert.holding_no || '-'}</span></td></tr>
        <tr><td>মৌজা</td><td>:<span style="margin-left:7px;"> ${cert.mouza || '-'}</span></td> 
        <td>ডাকঘর</td><td>:<span style="margin-left:7px;"> ${cert.post_office || '-'}</span></td></tr>
      </table>

      <p style="margin-top: 30px;">তিনি উপরোক্ত ঠিকানার একজন স্থায়ী বাসিন্দা এবং ব্যক্তিগতভাবে আমার পরিচিত। আমার জানামতে তিনি জন্মসূত্রে বাংলাদেশী নাগরিক। তিনি রাষ্ট্র বা সমাজবিরোধী কোনো কার্যকলাপের সঙ্গে জড়িত নন।</p>

      <p style="margin-top: 10px;">আমি তার সর্বাঙ্গীন সফলতা ও মঙ্গল কামনা করছি।</p>

      <div style="margin-top: 100px; text-align: right;">
        <div style="text-align: center; margin-left: 350px;">
          <p style="margin: 0;">${signer.name}</p>
          <p style="margin: 0;">${designationText}</p>
          <p style="margin: 0;">${signer.office1}</p>
          <p style="margin: 0;">${signer.office4}</p>
        </div>
      </div>

      <div style="position: absolute; bottom: 40px; left: 50%;">
        <img src="/qr.png" alt="QR Code" style="width: 80px; transform: translateX(-50%);">
      </div>
    </div>
  `

  const newWin = window.open('', '', 'width=800,height=1000')
  newWin.document.write(printContents)
  newWin.document.close()
  newWin.focus()
  newWin.print()
  newWin.close()
}


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
