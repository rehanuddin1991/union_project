'use client'
import { useEffect, useState, useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [form, setForm] = useState({
    id: null,
    type: '',
    applicantName: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    address: '',
    issuedDate: '',
    notes: '',
  })

  const printRef = useRef()

  // Load all certificates
  const fetchCertificates = async () => {
    const res = await fetch('/api/certificates')
    const data = await res.json()
    if(data.success) setCertificates(data.certificates)
    else toast.error('Failed to load certificates')
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const resetForm = () => {
    setForm({
      id: null,
      type: '',
      applicantName: '',
      fatherName: '',
      motherName: '',
      birthDate: '',
      address: '',
      issuedDate: '',
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
      if(data.success) {
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
    if(!confirm('ডিলিট নিশ্চিত করবেন?')) return
    const res = await fetch(`/api/certificates?id=${id}`, { method: 'DELETE' })
    const data = await res.json()
    if(data.success) {
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
      issuedDate: cert.issuedDate ? cert.issuedDate.substring(0, 10) : '',
      notes: cert.notes || '',
    })
  }

  // প্রিন্ট ফাংশন - শুধু নির্দিষ্ট সনদ প্রিন্ট করতে পারবে
  const handlePrint = (cert) => {
    const printContents = `
      <div style="padding: 30px; font-family: 'SolaimanLipi', sans-serif; line-height: 1.6; font-size: 16px;">
  <!-- অফিস হেডিং -->
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="margin: 0;">ইউপি প্রশাসকের কার্যালয়</h2>
    <h3 style="margin: 0;">১নং রামগড় ইউনিয়ন পরিষদ</h3>
    <h4 style="margin: 0;">রামগড়, খাগড়াছড়ি</h4>
    <p style="margin: 5px 0; font-size: 14px;"> <u>www.ramgarhup.khagrachhari.gov.bd </u></p>
    
  </div>

  <!-- সনদের নাম -->
  <h2 style="text-align: center; text-decoration: underline; margin-bottom: 20px;">
    ${cert.type}
  </h2>

  <!-- তথ্যসমূহ -->
  <h4 style="margin-top: 10px;">স্মারক নং:  <span style="margin-left: 370px;">তারিখ:</span></h4>
  <p><strong>আবেদনকারীর নাম:</strong> ${cert.applicantName}</p>
  <p><strong>পিতার নাম:</strong> ${cert.fatherName || '-'}</p>
  <p><strong>মাতার নাম:</strong> ${cert.motherName || '-'}</p>
  <p><strong>জন্ম তারিখ:</strong> ${cert.birthDate ? cert.birthDate.substring(0,10) : '-'}</p>
  <p><strong>ঠিকানা:</strong> ${cert.address || '-'}</p>
   
  <p>  ${cert.notes || '-'}</p>

  <!-- স্বাক্ষর -->
  <div style="margin-top: 150px; text-align: right;">
  <div style="  text-align: center;margin-left:350px">
   
    <p style="margin: 0;">রেহান উদ্দিন</p>
    <p style="margin: 0;">দায়িত্বপ্রাপ্ত কর্মকর্তা</p>
    <p style="margin: 0;">১নং রামগড় ইউনিয়ন পরিষদ</p>
    <p style="margin: 0;">ও</p>
    <p style="margin: 0;">উপজেলা আইসিটি অফিসার</p>
    <p style="margin: 0;">রামগড়, খাগড়াছড়ি</p>
  </div>
  </div>
</div>

    `
    const newWin = window.open('', '', 'width=600,height=700')
    newWin.document.write(printContents)
    newWin.document.close()
    newWin.focus()
    newWin.print()
    newWin.close()
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ইউনিয়ন পরিষদ সনদ ম্যানেজমেন্ট</h1>

      <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow mb-8 space-y-4">
        <div>
          <label className="font-semibold">সনদের ধরন</label>
          <select
            required
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
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
            onChange={e => setForm({ ...form, applicantName: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="আবেদনকারীর নাম"
          />
        </div>

        <div>
          <label className="font-semibold">পিতার নাম</label>
          <input
            type="text"
            value={form.fatherName}
            onChange={e => setForm({ ...form, fatherName: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="পিতার নাম (ঐচ্ছিক)"
          />
        </div>

        <div>
          <label className="font-semibold">মাতার নাম</label>
          <input
            type="text"
            value={form.motherName}
            onChange={e => setForm({ ...form, motherName: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="মাতার নাম (ঐচ্ছিক)"
          />
        </div>

        <div>
          <label className="font-semibold">জন্ম তারিখ</label>
          <input
            type="date"
            value={form.birthDate}
            onChange={e => setForm({ ...form, birthDate: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold">ঠিকানা</label>
          <textarea
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
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
            onChange={e => setForm({ ...form, issuedDate: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold">নোটস</label>
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className="border p-2 rounded w-full"
            placeholder="অতিরিক্ত তথ্য (ঐচ্ছিক)"
            rows={2}
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
                <td colSpan={9} className="text-center p-4">কোনো সনদ পাওয়া যায়নি।</td>
              </tr>
            )}
            {certificates.map(cert => (
              <tr key={cert.id}>
                <td className="border p-2">{cert.type}</td>
                <td className="border p-2">{cert.applicantName}</td>
                <td className="border p-2">{cert.fatherName || '-'}</td>
                <td className="border p-2">{cert.motherName || '-'}</td>
                <td className="border p-2">{cert.birthDate ? cert.birthDate.substring(0,10) : '-'}</td>
                <td className="border p-2">{cert.address || '-'}</td>
                <td className="border p-2">{cert.issuedDate ? cert.issuedDate.substring(0,10) : '-'}</td>
                <td className="border p-2">{cert.notes || '-'}</td>
                <td className="border p-2 space-x-1">
                  <button onClick={() => handleEdit(cert)} className="text-blue-600">✏️</button>
                  <button onClick={() => handleDelete(cert.id)} className="text-red-600">🗑</button>
                  <button onClick={() => handlePrint(cert)} className="text-green-600">🖨️</button>
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
