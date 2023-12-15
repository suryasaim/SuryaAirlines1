import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Registrationstudent from './Components/RegistrationUser';
import Login from './Components/login';
import Layout from './Components/layout';
import Dashboard from './Components/dashboard';

import BarChartByBrand from './Components/Brandprice/CarBrands';
import BodyTypeChart from './Components/Brandprice/BodyType';
import LocationChart from './Components/Brandprice/Location';
import YearChart from './Components/Brandprice/Year';
import ModelChart from './Components/Brandprice/Modelprice';
import TableReport from './Components/Brandprice/Tablereport';
import Airports from './Components/Airports/Airport';
import AddAirport from './Components/Airports/addairport';
import EditAirport from './Components/Airports/editairport';

import AdminLayout from './Components/adminlayout';
import AdminDashboard from './Components/admindashboard';
import { ToastContainer } from 'react-toastify';
import Flights from './Components/Flights/flights';
import AddFlight from './Components/Flights/addflight';
import EditFlight from './Components/Flights/editflight';
import ScheduleFlights from './Components/Scheduling/addschedule';
import Schedule from './Components/Scheduling/viewschedules';
import UpdateSchedule from './Components/Scheduling/editschedule';
import BookingDetails from './Components/Booking/bookingdetails';
import SeatSelection from './Components/Booking/seatbooking';
import ConfirmBooking from './Components/Booking/confirmbooking';
///


// 
 
// import Users from './Components/Users/users';
// import UpdateUser from './Components/Users/updateuser';
// import AddAdmin from './Components/Users/addadmin';

// import Slots from './Components/Slots/slots';
// import AddSlot from './Components/Slots/addslot';

// import DisplaySlots from './Components/Slots/displayslots';
///
function App() {
  return(
    <div className="App">
      <ToastContainer/>
      <Router>
        <Routes>
        <Route path='/' element={<Registrationstudent/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/layout' element={<Layout />} />
        <Route path='/dashboard' element={<Dashboard />} />
   
        <Route path='/dashboard/Brandprice/CarBrands' element={<BarChartByBrand/>} />
        <Route path='/dashboard/Brandprice/BodyType' element={<BodyTypeChart/>} /> 
        <Route path='/dashboard/Brandprice/Location' element={<LocationChart />} />
        <Route path='/dashboard/Brandprice/Modelprice' element={<ModelChart />} />
        <Route path='/dashboard/Brandprice/Year' element={<YearChart />} />
        <Route path='/dashboard/Brandprice/Tablereport' element={<TableReport/>} />
        <Route path='/admin/Airports/Airport' element={<Airports />} />
        <Route path='/admin/Airports/addairport' element={<AddAirport />} />
        <Route path='/admin/Airports/editairport/:id' element={<EditAirport />} />
       
      
        <Route path='/adminlayout' element={<AdminLayout />} />
        <Route path='/admindashboard' element={<AdminDashboard />} />
        <Route path='/admin/Flights/flights' element={<Flights />} />
        <Route path='/admin/Flights/addflight' element={<AddFlight />} />
        <Route path='/admin/Flights/editflight/:id' element={<EditFlight />} />
        <Route path='/admin/Scheduling/addschedule' element={<ScheduleFlights />} />
        <Route path='/admin/Scheduling/viewschedules' element={<Schedule />} />
        <Route path='/admin/Scheduling/editschedule/:id' element={<UpdateSchedule />} />
        <Route path='/Booking/bookingdetails/:id' element={<BookingDetails/>} />
        <Route path='/Booking/seatbooking/:id' element={<SeatSelection/>} />
        <Route path='/Booking/Confirmbooking/:id' element={<ConfirmBooking/>} />

        ---
    
        
      
        
        
        {/* 
        
        
        <Route path='/professor/Professors/attendance' element={<Attendance />} />
      
        <Route path='/admin/Users/users' element={<Users />} />   
        <Route path='/admin/Users/updateuser/:id' element={<UpdateUser />} /> 
        <Route path='/admin/Users/addadmin' element={<AddAdmin />} />
      
        <Route path='/admin/Slots/slots' element={<Slots/>} /> 
        <Route path='/admin/Slots/addslot' element={<AddSlot/>} /> 
        <Route path='/admin/Slots/editslot/:id' element={<EditSlot/>} /> 
        <Route path='/admin/Slots/displayslots' element={<DisplaySlots/>} />  */}


        
        </Routes>
      </Router>
    
    </div>
  );

}  
export default App;