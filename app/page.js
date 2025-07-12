'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
     const fetchEmployees = async () => {
  try {
    const res = await fetch("/api/employees");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (data.success) {
      setEmployees(data.employees);
    } else {
      console.error("API returned unsuccessful response");
    }
  } catch (err) {
    console.error("Failed to fetch employees", err);
  }
};


    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-indigo-200 to-purple-200 flex items-center justify-center p-10">
      <div className="flex flex-col md:flex-row flex-wrap gap-10 max-w-7xl w-full justify-center">
        {employees.map((emp, i) => (
          <div key={emp.id} className="card w-full md:w-96 bg-white shadow-xl border border-indigo-300 hover:shadow-indigo-600 transition-shadow duration-300 rounded-xl flex flex-col">
            <figure className="px-16 pt-8">
              <Image
                src={ `/images/${i + 1}.jpg` }
                width={200}
                height={200}
                alt={emp.name}
                priority  
                className="rounded-full shadow-lg border-4 border-indigo-300"
              />
            </figure>
            <div className="card-body flex flex-col items-center text-center p-8 flex-grow">
              <h2 className="card-title text-indigo-800 text-3xl font-extrabold mb-3">
                {emp.name}
              </h2>
              <p className="text-gray-700 text-lg font-medium leading-relaxed mb-6">
                {emp.designation.replace(/_/g, ' ')} <br />
                ১ নং রামগড় ইউনিয়ন পরিষদ <br />
                রামগড়, খাগড়াছড়ি
              </p>
              <div className="mt-auto">
                <div className="badge badge-outline text-indigo-700 border-indigo-500 text-lg px-5 py-3">
                  মোবাইল: {emp.mobile || '---'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
