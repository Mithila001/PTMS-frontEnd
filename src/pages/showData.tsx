import { useState, useEffect } from "react";

interface TestData {
  id: number;
  name: string;
}

function ShowData() {
  const [data, setData] = useState<TestData[]>([]);

  useEffect(() => {
    // Fetch data from the Spring Boot backend
    fetch("/api/test-data")
      .then((response) => response.json())
      .then((data: TestData[]) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Test Data from Spring Boot Backend</h1>
        {/* Check if data exists before rendering the table */}
        {data.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {/* TypeScript ensures 'item' is of type 'TestData' */}
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading data...</p>
        )}
      </header>
    </div>
  );
}

export default ShowData;
