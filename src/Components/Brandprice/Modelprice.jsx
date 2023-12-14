import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import axios from 'axios';
import Layout from '../layout';
import { CategoryScale, LinearScale } from 'chart.js'; 
import Chart from 'chart.js/auto';
Chart.register(CategoryScale, LinearScale);

const ModelChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adjust the API endpoint to fetch model data
        const response = await axios.get('https://localhost:7200/api/ModelData/GetModelData');
        const data = response.data;

        console.log('Model Data:', data);

        if (data && data.length > 0) {
          const labels = data.map((item) => item.model);
          const prices = data.map((item) => item.sumofPrice);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Sum of Price',
                data: prices,  // Use prices directly for Bar chart
                backgroundColor: 'rgba(255, 105, 180, 0.6)',  // Bright pink color for the bars
                borderColor: 'rgba(255, 105, 180, 1)',  // Border color for the bars
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error('Model Data is empty or undefined.');
        }
      } catch (error) {
        console.error('Error fetching model data:', error);
        setError('Error fetching model data. Please try again.');
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
      <h2>Model Report</h2>
      <div style={{ width: '80vw', height: '75vh' }}>
        <Bar
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

export default ModelChart;
