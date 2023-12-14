import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Layout from '../layout';
import { CategoryScale } from 'chart.js'; 
import  Chart  from 'chart.js/auto';
Chart.register(CategoryScale);

const YearChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adjust the API endpoint to fetch year data
        const response = await axios.get('https://localhost:7200/api/YearData/GetYearData');
        const data = response.data;

        console.log('Year Data:', data);

        if (data && data.length > 0) {
          const labels = data.map((item) => item.year);
          const prices = data.map((item) => item.sumofPrice);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Sum of Price',
                data: prices,
                fill: true, // This enables the area fill
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error('Year Data is empty or undefined.');
        }
      } catch (error) {
        console.error('Error fetching year data:', error);
        setError('Error fetching year data. Please try again.');
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
      <h2>Yearly Report</h2>
      <div style={{ width: '80vw', height: '75vh' }}>
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Year',
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

export default YearChart;
