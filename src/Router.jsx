import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="team" element={<ProtectedRoute element={<Team />} />} />
          <Route path="contacts" element={<ProtectedRoute element={<Contacts />} />} />
          <Route path="invoices" element={<ProtectedRoute element={<Invoices />} />} />
          <Route path="form" element={<ProtectedRoute element={<Form />} />} />
          <Route path="calendar" element={<ProtectedRoute element={<Calendar />} />} />
          <Route path="bar" element={<ProtectedRoute element={<Bar />} />} />
          <Route path="pie" element={<ProtectedRoute element={<Pie />} />} />
          <Route path="stream" element={<ProtectedRoute element={<Stream />} />} />
          <Route path="line" element={<ProtectedRoute element={<Line />} />} />
          <Route path="faq" element={<ProtectedRoute element={<FAQ />} />} />
          <Route path="geography" element={<ProtectedRoute element={<Geography />} />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
