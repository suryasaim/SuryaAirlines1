import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import Layout from '../layout';
import { CategoryScale } from 'chart.js'; 
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

const BodyTypeChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7200/api/CsvBodyTypeCount/GetBodyTypeCountCsvData');
        const data = response.data;

        console.log('Data:', data);

        if (data && data.length > 0) {
          const labels = data.map((item) => item.bodyType);
          const counts = data.map((item) => item.countOfCar);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Count of Cars',
                data: counts,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(255, 205, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  // Add more bright colors as needed
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error('Data is empty or undefined.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout>
      <h2>Body Types</h2>
      <div style={{ width: '80vw', height: '75vh' }}>
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    </Layout>
  );
};

export default BodyTypeChart;
