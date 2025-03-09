import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentValidationListBody = ({ studentId }) => {
  const [validations, setValidations] = useState([]);
  const [filteredValidations, setFilteredValidations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [validityPeriod, setValidityPeriod] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueUnicodes, setUniqueUnicodes] = useState([]);
  const [universities, setUniversities] = useState({});
  const location = useLocation();
  const { participantAddress } = location.state || {};

  useEffect(() => {
    if (!studentId) return;

    // Fetch all validations
    fetch(`http://localhost:5000/api/validations`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch validations. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.length) {
          throw new Error("No validations found.");
        }
        setValidations(data);
        setFilteredValidations(data);

        // Extract unique unicodedst values and fetch university details for each
        const uniqueUnicodesSet = new Set(data.map(v => v.unicodedst));
        setUniqueUnicodes([...uniqueUnicodesSet]);
      })
      .catch(error => console.error("Error fetching validations:", error));
  }, [studentId]);

  useEffect(() => {
    // Fetch university details for each unique unicodedst
    uniqueUnicodes.forEach(unicodedst => {
      fetch(`http://localhost:5000/api/universities/${unicodedst}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch university for ${unicodedst}. Status: ${response.status}`);
          }
          return response.json();
        })
        .then(uniData => {
          setUniversities(prev => ({
            ...prev,
            [unicodedst]: uniData
          }));
        })
        .catch(error => console.error("Error fetching university:", error));
    });
  }, [uniqueUnicodes]);

  useEffect(() => {
    let results = validations;
    if (searchTerm) {
      results = results.filter((valid) =>
        valid.courseidsrc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (validityPeriod) {
      results = results.filter((valid) => parseInt(valid.period) >= parseInt(validityPeriod));
    }
    if (universityName) {
      results = results.filter((valid) => {
        const university = universities[valid.unicodedst];
        return university && university.name.toLowerCase().includes(universityName.toLowerCase());
      });
    }
    setFilteredValidations(results);
  }, [searchTerm, validityPeriod, universityName, validations, universities]);

  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Courses</h2>
          <div style={filterContainer}>
            <input
              type="text"
              placeholder="Search by Course ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setShowFilters(!showFilters)}>Search Options</button>
          </div>
          {showFilters && (
            <div style={filterContainer}>
              <input
                type="number"
                placeholder="Validity Period (Year)"
                value={validityPeriod}
                onChange={(e) => setValidityPeriod(e.target.value)}
              />
              <select value={universityName} onChange={(e) => setUniversityName(e.target.value)}>
                <option value="">Select University</option>
                {Object.values(universities).map((university) => (
                  <option key={university.unicode} value={university.name}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Origin Course</th>
                <th style={thStyle}>Destination Course</th>
                <th style={thStyle}>Validity Period</th>
                <th style={thStyle}>University Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredValidations.map((validatid) => (
                <tr key={validatid.unicode}>
                  <td style={tdStyle}>{validatid.unicodesrc}, {validatid.degreeidsrc}, {validatid.courseidsrc}</td>
                  <td style={tdStyle}>{validatid.unicodedst}, {validatid.degreeiddst}, {validatid.courseiddst}</td>
                  <td style={tdStyle}>{validatid.period}</td>
                  <td style={tdStyle}>
                    {universities[validatid.unicodedst] ? (
                      <div>{universities[validatid.unicodedst].name}</div>
                    ) : (
                      <div>Loading...</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  height: '100vh',
  backgroundColor: '#f4f4f4',
};

const mainContentStyle = {
  flex: 1,
  marginLeft: '20px',
};

const tableContainer = {
  background: '#fff',
  padding: '20px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
};

const tableTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'center',
};

const thStyle = {
  padding: '10px',
  backgroundColor: '#f4f4f4',
  fontWeight: 'bold',
  borderBottom: '2px solid #ccc',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee',
  textAlign: 'center',
};

const filterContainer = {
  display: 'flex',
  gap: '10px',
  marginBottom: '10px',
};

export default StudentValidationListBody;
