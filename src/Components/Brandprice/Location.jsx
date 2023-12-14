import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Layout from '../layout';
import { CategoryScale } from 'chart.js'; 
import  Chart  from 'chart.js/auto';
Chart.register(CategoryScale);


const LocationChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7200/api/LocationData/GetLocationData');
        const data = response.data;

        console.log('Data:', data);

        if (data && data.length > 0) {
          const labels = data.map((item) => item.location);
          const prices = data.map((item) => item.sumofPrice);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Sum of Price',
                data: prices,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 2,
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
      <h2>Location Report</h2>
      <div style={{ width: '80vw', height: '75vh' }}>
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Location',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Sum of Price',
                },
              },
            },
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    </Layout>
  );
};

export default LocationChart;
