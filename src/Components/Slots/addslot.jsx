import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { airlinesapi , SuryaairlineUrl} from '../../Constant';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ImageSlider from './imageslider';



function FindFlights() {
  const [cityNames, setCityNames] = useState([]);
  const [sourceAirportId, setSourceAirportId] = useState('');
  const [destinationAirportId, setDestinationAirportId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableFlights, setAvailableFlights] = useState([]);
  const [connectedFlights, setConnectedFlights] = useState([]);
  const [bookingInfo, setBookingInfo] = useState(null);


  const navigate = useNavigate();
  const [finalIntegratedConnectingFlights,setFinalIntegratedConnectingFlights] =useState([])

  useEffect(() => {
    async function fetchCityNames() {
      try {
        const response = await axios.get('http://192.168.10.71:98/api/Airport');
        const airports = response.data;
        setCityNames(airports);
      } catch (error) {
        console.error('Error fetching airport data:', error);
      }
    }

    fetchCityNames();
  }, []);

  const handleSearch = async () => {
    try {

      if (!sourceAirportId || !destinationAirportId) {
        toast.error('Invalid source or destination airport. Please try again.');
        return;
      }
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      localStorage.setItem('flightSearchParameters', JSON.stringify({
        sourceAirportId,
        destinationAirportId,
        selectedDate: formattedDate,
      }));
      console.log(sourceAirportId);
      console.log(destinationAirportId);
      console.log(formattedDate);
  
      let directFlightResponse = [];
      let connectingFlightResponse = [];
  
      // Search for direct flights
      try {
        const directResponse = await axios.get(`http://192.168.10.71:98/api/Integration/directflight/${sourceAirportId}/${destinationAirportId}/${formattedDate}`);
        directFlightResponse = directResponse.data;
        console.log(directFlightResponse);
      } catch (directError) {
        console.info('Error fetching direct flights:', directError);
        toast.info('No Direct flights Available');
      }
  
      // Search for connecting flights
      try {
        const connectingResponse = await axios.get(`http://192.168.10.71:98/api/Integration/connectingflight/${sourceAirportId}/${destinationAirportId}/${formattedDate}`);
        connectingFlightResponse = connectingResponse.data;
        console.log(connectingFlightResponse);
      } catch (connectingError) {
        console.info('Error fetching connecting flights:', connectingError);
        toast.info('No connecting flights Available');
      }
  
      // Set the results for direct flights
      if (directFlightResponse.length > 0) {
        setAvailableFlights(directFlightResponse);
        localStorage.setItem('flightSearchResults', JSON.stringify(directFlightResponse));
      } else {
        toast.info('No direct flights found for the selected route and date.');
        setAvailableFlights([]);
      }
  
      // Set the results for connecting flights
      if (connectingFlightResponse.length > 0) {
        const integratedConnectingFlights = [];
      
        for (const connectingFlight of connectingFlightResponse) {
          // Search for the second leg of the connecting flight
          const firstFlightDestinationId = connectingFlight.destinationAirportId;  // Use destinationAirportId instead of sourceAirportId
          const firstFlightDate = formattedDate;
      
          try {
            
            const secondFlightResponse = await axios.get(
              `http://192.168.10.71:98/api/Integration/directflight/${firstFlightDestinationId}/${destinationAirportId}/${firstFlightDate}`
            );
            console.log(secondFlightResponse)
            if (secondFlightResponse.data.length > 0) {
              // Second leg found, integrate both legs
              integratedConnectingFlights.push({
                firstLeg: connectingFlight,
                secondLeg: secondFlightResponse.data[0],
              });
            }
          } catch (secondLegError) {
            console.info('Error fetching second leg:', secondLegError);
            toast.info('No second leg of connecting flights available');
          }
        }
        console.log(integratedConnectingFlights)
        setConnectedFlights(integratedConnectingFlights);
      } else {
        toast.info('No connecting flights found for the selected route and date.');
        setConnectedFlights([]);
      }
    } catch (error) {
      console.error('Error during flight search:', error);
      toast.error('Error during flight search');
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log(SuryaairlineUrl);
    console.log(airlinesapi);
    console.log(sourceAirportId);
    console.log(destinationAirportId);
    console.log(formattedDate);
    
    getIntegratedFlightDetails(
      SuryaairlineUrl,
      airlinesapi,
      sourceAirportId,
      destinationAirportId,
      formattedDate
    );
    };
    
    const getIntegratedFlightDetails = async (
      firstAirlines,
      secondAirlines,
      source,
      destination,
      dateTime
) => {
  const connectionSchedules = [];
  console.log(dateTime)
  await Promise.all(
    Object.entries(firstAirlines).map(
      async ([firstAirlineName, firstAirline]) => {
        try {
          console.log(firstAirline.apiPath, dateTime);
          console.log(`${firstAirline.apiPath}Integration/connectingflight/${source}/${destination}/${dateTime}`
          )
          const firstResponse = await axios.get(
            `${firstAirline.apiPath}Integration/connectingflight/${source}/${destination}/${dateTime}`
          );
          console.log(firstResponse);
          const firstFlights = firstResponse.data.map((firstFlight) => ({
            ...firstFlight,
            airlineName: firstAirlineName,
            apiPath: firstAirline.apiPath,
          }));
          console.log(firstFlights);

          if (firstFlights && firstFlights.length > 0) {
            await Promise.all(
              firstFlights.map(async (firstFlight) => {
                await Promise.all(
                  Object.entries(secondAirlines).map(
                    async ([secondAirlineName, secondAirline]) => {
                      console.log(secondAirline);
                      try {
                        console.log(`${secondAirline.apiPath}Integration/directflight/${firstFlight.destinationAirportId}/${destination}/${dateTime}`
                        )
                        const secondResponse = await axios.get(`${secondAirline.apiPath}Integration/directflight/${firstFlight.destinationAirportId}/${destination}/${dateTime}`
                        );

                        console.log(secondResponse);
                        const secondFlights = secondResponse.data.map(
                          (secondFlight) => ({
                            ...secondFlight,
                            airlineName: secondAirlineName,
                            apiPath: secondAirline.apiPath,
                          })
                        );

                        if (secondFlights && secondFlights.length > 0) {
                          console.log(secondFlights);
                          secondFlights.forEach((secondFlight) => {
                            const connectionSchedule = {
                              FirstFlight: firstFlight,
                              SecondFlight: secondFlights,
                            };
                            console.log(connectionSchedule);
                            connectionSchedules.push(connectionSchedule);
                          });
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  )
                );
              })
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
    )
  );
  console.log(connectionSchedules)
  setFinalIntegratedConnectingFlights(connectionSchedules); // Uncomment this line if you want to use this data in your application
};
////////////
const calculateArrivalTime = (departureDateTime, duration) => {
  const departureTime = new Date(departureDateTime).getTime();
  const durationMilliseconds = durationToMilliseconds(duration);
  const arrivalTime = new Date(departureTime + durationMilliseconds);
  return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


const calculateArrivalDate = (departureDateTime, duration) => {
  const departureTime = new Date(departureDateTime).getTime();
  const durationMilliseconds = durationToMilliseconds(duration);
  const arrivalTime = new Date(departureTime + durationMilliseconds);
  return arrivalTime.toISOString().split('T')[0];
};
const durationToMilliseconds = (duration) => {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

const handleBookNowIntegratedConnecting = (firstflightScheduleId, secondflightScheduleId, firstAirlineApiPath, secondAirlineApiPath,firstAirlineName,secondAirlineName,firstFlightSourceId,secondFlightSourceId,firstFlightDestinationId,secondFlightDestinationId,firstflightName,secondflightName,firstFlightDateTime,secondFlightDateTime) => {
  const isAuthenticated = localStorage.getItem('userId') !== null;

  if (isAuthenticated) {
    const userId = localStorage.getItem('userId');
    const scheduleIds = [firstflightScheduleId, secondflightScheduleId];
    
    // Get the API paths from the function parameters and save them in sessionStorage
    const apiPaths = [firstAirlineApiPath, secondAirlineApiPath];
    console.log(apiPaths)
    //const flightName = [firstAirlineName,firstFlightSourceId,firstFlightDestinationId,firstflightName]
    const airlineNames= [firstAirlineName,secondAirlineName]
    const flightNames= [firstflightName,secondflightName]
    const sourceIds=[firstFlightSourceId,secondFlightSourceId]
    const destinationIds=[firstFlightDestinationId,secondFlightDestinationId]
    const dateTimes=[firstFlightDateTime,secondFlightDateTime]
    //const secondFlightDetails = [secondAirlineName,secondFlightSourceId,secondFlightDestinationId,secondflightName]
    console.log(dateTimes)
    
    console.log(airlineNames)
    sessionStorage.setItem('integratedBookingInfo', JSON.stringify({ userId, scheduleIds, apiPaths,flightNames,sourceIds,destinationIds,airlineNames,dateTimes}));
    
    // Navigate to the booking details page
    navigate(`/IntegratedBooking/integratedbookingdetails/${firstflightScheduleId}`);
  } else {
    navigate('/login');
  }
};

 
  
//////////

  
  const handleBookNow = (scheduleId) => {
    const isAuthenticated = localStorage.getItem('userId') !== null;

    if (isAuthenticated) {
      const userId = localStorage.getItem('userId');
      sessionStorage.setItem('bookingInfo', JSON.stringify({ userId, scheduleId }));
      navigate(`/Booking/bookingdetails/${scheduleId}`);
    } else {
      navigate('/login');
    }
  };

  const handleBookNowConnecting = (firstLegScheduleId, secondLegScheduleId) => {
    const isAuthenticated = localStorage.getItem('userId') !== null;
  
    if (isAuthenticated) {
      const userId = localStorage.getItem('userId');
      const bookingInfo = { userId, scheduleIds: [firstLegScheduleId, secondLegScheduleId] };
      sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
      navigate(`/ConnectBooking/Connectbookingdetails/${firstLegScheduleId}`);
    } else {
      navigate('/login');
    }
  };

  const calculateDepartureTime = (arrivalTime, duration) => {
    const arrivalDateTime = new Date(arrivalTime);
    const durationParts = duration.split(':');
    const hours = parseInt(durationParts[0], 10);
    const minutes = parseInt(durationParts[1], 10);

    const departureDateTime = new Date(arrivalDateTime);
    departureDateTime.setHours(departureDateTime.getHours() + hours);
    departureDateTime.setMinutes(departureDateTime.getMinutes() + minutes);

    return departureDateTime;
  };

  return (
    
    <div className="container mt-4">
      <ImageSlider />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <div className="bg-info text-center"style={{  borderRadius: '5px' }} >
          <h2 className="m-1">Find Your Destination</h2>
    
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="sourceAirport">Source Airport:</label>
            <select
              id="sourceAirport"
              className="form-control"
              value={sourceAirportId}
              onChange={(e) => setSourceAirportId(e.target.value)}
            >
              <option value="">Select Source Airport</option>
              {cityNames.map((airport, index) => (
                <option key={index} value={airport.airportId}>
                  {airport.city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="destinationAirport">Destination Airport:</label>
            <select
              id="destinationAirport"
              className="form-control"
              value={destinationAirportId}
              onChange={(e) => setDestinationAirportId(e.target.value)}
            >
              <option value="">Select Destination Airport</option>
              {cityNames.map((airport, index) => (
                <option key={index} value={airport.airportId}>
                  {airport.city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="departureDate">Departure Date:</label>
            <DatePicker
             id="departureDate"
             selected={selectedDate}
             onChange={(date) => setSelectedDate(date)}
             dateFormat="MMMM d, yyyy"
             minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)} // Set minDate to tomorrow
             className="form-control"
           />
          </div>
        </div>
        <div className="col-md-3">
          <button onClick={handleSearch} className="btn btn-primary">
            Search Flights
          </button>
        </div>
      </div>
      {availableFlights.length > 0 && (
  <div className="container mt-4" style={{ width: '60vw' }}>
    <h2 className="mb-3">Available Flights</h2>
    <div className="row">
      {availableFlights.map((flight) => (
        <div key={flight.scheduleId} className="col-md-12 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="text-center mb-3 text-success fs-5">
                <FontAwesomeIcon icon={faPlane} className="mr-2" style={{ fontSize: '2em' }} />
                <span className="airline-name">{flight.flightName}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="text-center">
                  <p className="card-text">
                    <strong>From:</strong> {flight.sourceCity} ({flight.sourceAirportName})
                  </p>
                  <p className="card-text">
                    <strong>Arrival Time:</strong>{' '}
                    {new Date(flight.dateTime).toLocaleString('en-GB')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="card-text">
                    <strong>To:</strong> {flight.destinationCity} ({flight.destinationAirportName})
                  </p>
                  <p className="card-text">
                    <strong>Departure Time:</strong>{' '}
                    {calculateDepartureTime(flight.dateTime, flight.flightDuration).toLocaleString('en-GB')}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="card-text">
                  <strong>Duration:</strong> {flight.flightDuration}
                </p>
              </div>
              <button onClick={() => handleBookNow(flight.scheduleId)} className="btn btn-primary mt-3">
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{connectedFlights.length > 0 && (
  <div className="container mt-3" style={{ width: '60vw' }}>
    <h3 className="mb-2">Connecting Flights</h3>
    <div className="row">
      {connectedFlights.map((connectingFlights, index) => (
        <div key={index} className="col-md-12 mb-3">
          <div className="card">
            <div className="card-body">
              {/* ... (existing code) */}
              <div className="mt-2" style={{ color: 'black', fontWeight: 'bold' }}>
                  <p>First Flight</p>
                </div>  
              <div className="text-center mb-3 text-primary fs-5">
                  <FontAwesomeIcon icon={faPlane} className="mr-4 pr-5" style={{ fontSize: '2em' }} />
                  <span className="airline-name">{connectingFlights.firstLeg.flightName}</span>
              </div>
                

              {/* Swap the positions of arrival time and departure time for the second leg */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-center">
                  <p className="card-text">
                    <strong>From:</strong> {connectingFlights.firstLeg.sourceCity} ({connectingFlights.firstLeg.sourceAirportName})
                  </p>
                  <p className="card-text">
                    <strong>Arrival Time:</strong>{' '}
                    {new Date(connectingFlights.firstLeg.dateTime).toLocaleString('en-GB')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="card-text">
                    <strong>To:</strong> {connectingFlights.firstLeg.destinationCity} ({connectingFlights.firstLeg.destinationAirportName})
                  </p>
                  <p className="card-text">
                    <strong>Departure Time:</strong>{' '}
                    {calculateDepartureTime(connectingFlights.firstLeg.dateTime, connectingFlights.firstLeg.flightDuration).toLocaleString('en-GB')}
                  </p>
                </div>
              </div>
                
                {/* Duration for the first leg */}
                <div className="text-center">
                  <p className="card-text">
                    <strong>Duration:</strong> {connectingFlights.firstLeg.flightDuration}
                  </p>
                </div>

                {/* Text for the second flight */}
                <div className="mt-2 mb-0" style={{ color: 'black', fontWeight: 'bold' }}>
                  <p>Second Flight</p>
                </div>
                {/* Details for the second leg */}
                <div className="text-center mb-3 text-primary fs-5">
                  <FontAwesomeIcon icon={faPlane} className="mr-2" style={{ fontSize: '2em' }} />
                  <span className="airline-name">{connectingFlights.secondLeg.flightName}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="text-center">
                    <p className="card-text">
                      <strong>From:</strong> {connectingFlights.secondLeg.sourceCity} ({connectingFlights.secondLeg.sourceAirportName})
                    </p>
                    <p className="card-text">
                      <strong>Arrival Time:</strong> {new Date(connectingFlights.secondLeg.dateTime).toLocaleString('en-GB')}
                    </p>
                    
                  </div>
                  <div className="text-center">
                    <p className="card-text">
                      <strong>To:</strong> {connectingFlights.secondLeg.destinationCity} ({connectingFlights.secondLeg.destinationAirportName})
                    </p>
                    <p className="card-text">
                      <strong>Departure Time:</strong>{' '}
                      {calculateDepartureTime(connectingFlights.secondLeg.dateTime, connectingFlights.secondLeg.flightDuration).toLocaleString('en-GB')}
                    </p>
                    
                  </div>
                </div>
                
                {/* Duration for the second leg */}
                <div className="text-center">
                  <p className="card-text">
                    <strong>Duration:</strong> {connectingFlights.secondLeg.flightDuration}
                  </p>
                </div>

                {/* Book Now button for connected flights */}
                <button onClick={() => handleBookNowConnecting(connectingFlights.firstLeg.scheduleId, connectingFlights.secondLeg.scheduleId)} className="btn btn-primary mt-3">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

<div className="container mt-4 bg-white" style={{ width: '60vw', }}>
  <div className="m-0">
    
    {finalIntegratedConnectingFlights.map((connection, index) => (
      <div key={index} className="flex justify-between">
        <h3>Integrated Connecting Flights</h3>
        <div className="flex border p-3 bold  rounded hover:cursor-pointer m-5">
          <div className="p-2">
                <div className="mt-0" style={{ color: 'blue', fontWeight: 'bold' }}>
                  <p>First Flight</p>
                </div>
            <div>
              <div className="text-center mb-3 text-primary fs-5">
              <FontAwesomeIcon icon={faPlane} className="mr-2" style={{ fontSize: '2em' }} />
                {connection.FirstFlight.flightName}
               </div>

               <div className="row mt-3">
                 <div className="col-md-6">
                   <strong>From:</strong> {connection.FirstFlight.sourceAirportName}
                 </div>
                 <div className="col-md-6 text-md-end">
                   <strong>To:</strong> {connection.FirstFlight.destinationAirportName}
                 </div>
               </div>

              
              <div className="row m-2">
                <div className="col-md-6 text-left">
                  <div className="m-1  ">
                   <strong>Arrival Date:</strong> {connection.FirstFlight.dateTime?.split('T')[0]},
                  </div>
                  <div>
                   <strong>Arrival Time:</strong> {connection.FirstFlight.dateTime?.split('T')[1]}
                  </div>
                </div>
                <div className="col-md-6 custom-right-align">
                  <div className="m-1 ">
                   <strong>Departure Date:</strong> {calculateArrivalDate(connection.FirstFlight.dateTime, connection.FirstFlight.flightDuration)},
                   </div>
                  <div>
                    <strong>Departure Time:</strong> {calculateArrivalTime(connection.FirstFlight.dateTime, connection.FirstFlight.flightDuration)}
                  </div>
                </div>
              </div>
              <div><strong>Flight Duration:</strong>  {connection.FirstFlight.flightDuration}</div>
            </div>
          </div>

          <div className="p-3">
               <div className="mt-2 mb-0" style={{ color: 'green', fontWeight: 'bold' }}>
                  <p>Second Flight</p>
                </div>
            <div>
               <div className="text-center mb-3 text-success fs-5">
                <FontAwesomeIcon icon={faPlane} className="mr-2" style={{ fontSize: '2em' }} />
                 {connection.SecondFlight[0].flightName}
               </div>
              <div>
                <strong>From:</strong> {connection.SecondFlight[0].sourceAirportName} <strong>To:</strong>{' '}
                {connection.SecondFlight[0].destinationAirportName}
              </div>
              
              <div className="row mt-2 mb-3">
                <div className="col-md-6 ">
                  <div className="m-1  ">
                    <strong>Arrival Date:</strong> {connection.SecondFlight[0].dateTime?.split('T')[0]},
                  </div>
                  <div>
                    <strong>Arrival Time:</strong> {connection.SecondFlight[0].dateTime?.split('T')[1]}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="m-1  ">
                    <strong>Departure Date:</strong> {calculateArrivalDate(connection.SecondFlight[0].dateTime, connection.SecondFlight[0].flightDuration)},
                  </div>
                  <div>
                    <strong>Departure Time:</strong> {calculateArrivalTime(connection.SecondFlight[0].dateTime, connection.SecondFlight[0].flightDuration)}
                  </div>
                </div>
              </div>

              <div> <strong>Flight Duration:</strong> {connection.SecondFlight[0].flightDuration}</div>
            </div>
          </div>
          {/* Common "Book Now" button */}
        <button
          onClick={() =>
            handleBookNowIntegratedConnecting(
              connection.FirstFlight.scheduleId,
              connection.SecondFlight[0].scheduleId,
              connection.FirstFlight.apiPath,
              connection.SecondFlight[0].apiPath,
              connection.FirstFlight.airlineName,
              connection.SecondFlight[0].airlineName,
              connection.FirstFlight.sourceAirportId,
              connection.SecondFlight[0].sourceAirportId,
              connection.FirstFlight.destinationAirportId,
              connection.SecondFlight[0].destinationAirportId,
              connection.FirstFlight.flightName,
              connection.SecondFlight[0].flightName,
              connection.FirstFlight.dateTime,
              connection.SecondFlight[0].dateTime
            )
          }
          className="btn btn-primary mt-3"
        >
          Book Now
        </button>
        </div>
        
      </div>
    ))}
  </div>
</div>



</div>
  );
}

export default FindFlights;
