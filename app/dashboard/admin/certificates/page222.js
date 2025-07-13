// File: app/certificates/page.js
'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactToPrint from 'react-to-print'
import CertificatePrint from '../../../../components/PrintContent'

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), { ssr: false })

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [employees, setEmployees] = useState([])
  const [settings, setSettings] = useState(null)
  const [now, setNow] = useState(null)
  const printRef = useRef()
  const [selectedCert, setSelectedCert] = useState(null)

  const today = new Date().toISOString().substring(0, 10)

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
    letter_count: ''
  })

  const fetchCertificates = async () => {
    const res = await fetch('/api/certificates')
    const data = await res.json()
    if (data.success) setCertificates(data.certificates)
    else toast.error('Failed to load certificates')
  }

  const fetchEmployees = async () => {
    const res = await fetch('/api/employees')
    const data = await res.json()
    if (data.success) setEmployees(data.employees)
    else toast.error('Failed to load employees')
  }

  const fetchOfficeSettings = async () => {
    const res = await fetch('/api/office_settings')
    const data = await res.json()
    if (data.success) setSettings(data.settings[0])
    else toast.error('অফিস সেটিংস লোড করতে ব্যর্থ হয়েছে')
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
    office4: 'রামগড়, খাগড়াছড়ি'
  }

  const designationText = signer.designation === 'OFFICER_IN_CHARGE'
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
      letter_count: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let letter_count = 1
    const firstLetterCount = certificates[0]?.letter_count

    if (firstLetterCount === null || firstLetterCount === 0 || isNaN(firstLetterCount)) {
      letter_count = parseInt(form.letter_count) || 1
    } else {
      letter_count = firstLetterCount + 1
    }

    const payload = { ...form, letter_count: parseInt(letter_count) }

    const method = form.id ? 'PATCH' : 'POST'
    const url = form.id ? `/api/certificates?id=${form.id}` : '/api/certificates'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
      letter_count: cert.letter_count || ''
    })
  }

  const handlePrint = (cert) => {
    setSelectedCert(cert)
    setTimeout(() => document.getElementById('triggerPrint')?.click(), 100)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ইউনিয়ন পরিষদ সকল সনদ</h1>

      {/* Your form and list code remains unchanged */}

      <div className="bg-white border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">সনদ তালিকা</h2>
        <table className="w-full text-sm border">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-2">সনদের ধরন</th>
              <th className="border p-2">আবেদনকারীর নাম</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td className="border p-2">{cert.type}</td>
                <td className="border p-2">{cert.applicantName}</td>
                <td className="border p-2 space-x-1">
                  <button onClick={() => handleEdit(cert)} className="text-blue-600">✏️</button>
                  <button onClick={() => handleDelete(cert.id)} className="text-red-600">🗑️</button>
                  <button onClick={() => handlePrint(cert)} className="text-green-600">🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'none' }}>
        {selectedCert && (
  <CertificatePrint
    ref={printRef}
    cert={selectedCert}
    settings={settings}
    signer={signer}
    designationText={designationText}
    formatDate={formatDate}
  />
)}
      </div>
      <ReactToPrint
        trigger={() => <button id="triggerPrint">Print</button>}
        content={() => printRef.current}
      />

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  )
}
