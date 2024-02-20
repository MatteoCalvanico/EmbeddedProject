import React, { useEffect, useState } from "react";

const DataComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setData(null);
      try {
        const response = await fetch("http://localhost:7000/");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const responseData = await response.text();
        console.log(responseData);
        setData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchData, 20000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {data ? (
        <p>Data from server: {JSON.stringify(data)}</p>
      ) : (
        <p>Fetching data...</p>
      )}
    </div>
  );
};

export default DataComponent;
