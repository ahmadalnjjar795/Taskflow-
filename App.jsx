import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar, { SIDEBAR_WIDTH } from "./components/Sidebar";
import Header from "./components/Header";
import TaskFormModal from "./components/TaskFormModal";
import TaskDetailsModal from "./components/TaskDetailsModal";
import ConfirmDialog from "./components/ConfirmDialog";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/AllTasks";
import CalendarPage from "./pages/CalendarPage";
import Settings from "./pages/Settings";
import Login from './pages/Login';
import Signup from './pages/Signup';
import { STATUS } from "./utils/constants";

function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}
      >
        <Header
          onMenuClick={() => setMobileOpen(true)}
          search={search}
          onSearchChange={setSearch}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2.5, md: 3.5 },
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard search={search} />} />
            <Route
              path="/tasks"
              element={
                <AllTasks
                  search={search}
                  title="nav_allTasks"
                  filterMode="all"
                />
              }
            />
            <Route
              path="/today"
              element={
                <AllTasks
                  search={search}
                  title="nav_today"
                  filterMode="today"
                />
              }
            />
            <Route
              path="/upcoming"
              element={
                <AllTasks
                  search={search}
                  title="nav_upcoming"
                  filterMode="upcoming"
                />
              }
            />
            <Route
              path="/completed"
              element={
                <AllTasks
                  search={search}
                  title="nav_completed"
                  filterMode="statusCompleted"
                />
              }
            />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      </Box>

      <TaskFormModal />
      <TaskDetailsModal />
      <ConfirmDialog />
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
