import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getEmployeeById } from "../api/employees";

const EmployeeDetail = () => {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    getEmployeeById(id)
      .then(res => setEmp(res.data))
      .catch(console.error);
  }, [id]);

  if (!emp) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl">
        
        <h2 className="text-xl font-bold mb-4">
          {emp.first_name} {emp.last_name}
        </h2>

        <div className="space-y-2 text-sm text-gray-600">
          <p><b>Phone:</b> {emp.phone_no}</p>
          <p><b>Address:</b> {emp.address}</p>
          <p><b>State:</b> {emp.state}</p>
          <p><b>Department:</b> {emp.professional_details?.department_name}</p>
          <p><b>Status:</b> {emp.professional_details?.is_active ? 'Active' : 'Inactive'}</p>
          <p><b>Joined:</b> {emp.professional_details?.joined_on}</p>
        </div>

      </div>
    </Layout>
  );
};

export default EmployeeDetail;