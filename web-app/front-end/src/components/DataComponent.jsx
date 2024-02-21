import React, { useEffect, useState } from "react";
import EspActions from "./EspActions";

const DataComponent = () => {
  const [data, setData] = useState([]);
  const [updatedMessages, setUpdatedMessages] = useState([]);

  useEffect(() => {
    let dataObjects = [];
    if (!(data instanceof Array)) {
      console.log(data);
      return;
    }
    for (const item of data) {
      const itemIndex = dataObjects.findIndex(
        (e) => e.ESPname === item.ESPname
      );
      if (itemIndex >= 0) {
        dataObjects[itemIndex] = item;
      } else {
        dataObjects.push(item);
      }
    }

    setUpdatedMessages(dataObjects);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:7000/");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        setData(responseData.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    const intervalId = setInterval(fetchData, 20000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Id Parcheggio</th>
            <th>Stato del Parcheggio</th>
            <th>Azioni ESP</th>
          </tr>
        </thead>
        <tbody>
          {updatedMessages.map((item) => (
            <tr>
              <td>{item.ESPname}</td>
              <td>{item.isParked ? "libero" : "occupato"}</td>
              <td>
                <EspActions espId={item.ESPname} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!data && <p>Fetching data...</p>}
    </div>
  );
};

export default DataComponent;
