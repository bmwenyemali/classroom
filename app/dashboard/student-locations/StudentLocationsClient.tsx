"use client";

import { useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1IjoiYmllbnZlbnUxMiIsImEiOiJjbWpuMGlrMjQxYnJ0M2dxMXJ1Mmk4dndlIn0.fhS-CcoTfYUN6i4oIrHYrQ";

interface Student {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  home_address: string;
  home_latitude: number;
  home_longitude: number;
}

interface StudentLocationsClientProps {
  students: Student[];
  userRole: string;
  userLocation: [number, number] | null;
}

export default function StudentLocationsClient({
  students,
  userRole,
  userLocation,
}: StudentLocationsClientProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const defaultCenter: [number, number] = [15.3136, -4.3276]; // Kinshasa

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation || defaultCenter,
      zoom: userLocation ? 12 : 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [userLocation]);

  // Add student markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll(".student-marker");
    existingMarkers.forEach((marker) => marker.remove());

    students.forEach((student) => {
      const el = document.createElement("div");
      el.className = "student-marker";
      el.style.cssText = `
        position: relative;
        width: 40px;
        height: 50px;
        cursor: pointer;
      `;

      // Create student icon
      const icon = document.createElement("div");
      icon.style.cssText = `
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23${
          selectedStudent?.id === student.id ? "f59e0b" : "8b5cf6"
        }" stroke="white" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>');
        background-size: contain;
        width: 32px;
        height: 32px;
        position: absolute;
        left: 4px;
        top: 0;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;

      // Create label
      const label = document.createElement("div");
      label.textContent = student.full_name;
      label.style.cssText = `
        position: absolute;
        top: 34px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(139, 92, 246, 0.9);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        z-index: 1;
      `;

      el.appendChild(icon);
      el.appendChild(label);

      el.addEventListener("mouseenter", () => {
        icon.style.filter = "brightness(1.2)";
        label.style.opacity = "1";
      });
      el.addEventListener("mouseleave", () => {
        icon.style.filter = "brightness(1)";
        label.style.opacity = "0";
      });

      const popupContent = document.createElement("div");
      popupContent.style.cssText = "padding: 8px; min-width: 220px;";
      popupContent.innerHTML = `
        <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">👨‍🎓 ${
          student.full_name
        }</h3>
        <p style="margin: 4px 0; font-size: 12px; color: #666;">📧 ${
          student.email
        }</p>
        ${
          student.phone
            ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">📞 ${student.phone}</p>`
            : ""
        }
        <p style="margin: 4px 0; font-size: 12px; color: #666;">📍 ${
          student.home_address
        }</p>
        <button 
          id="view-student-${student.id}" 
          style="
            width: 100%;
            margin-top: 8px;
            padding: 6px;
            background: #8b5cf6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          "
        >
          View Details
        </button>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 });
      popup.setDOMContent(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([student.home_longitude, student.home_latitude])
        .setPopup(popup)
        .addTo(map.current!);

      popup.on("open", () => {
        const btn = document.getElementById(`view-student-${student.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            setSelectedStudent(student);
            popup.remove();
          });
        }
      });
    });
  }, [students, mapLoaded, selectedStudent]);

  // Filter students
  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.home_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👨‍🎓 Student Locations
          </h1>
          <p className="text-gray-600">
            {userRole === "professor"
              ? "View home addresses of all students"
              : "View home addresses of your students"}
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <input
            type="text"
            placeholder="Search students by name, email, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student List */}
          <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-bold text-gray-900">
                {filteredStudents.length} Student
                {filteredStudents.length !== 1 ? "s" : ""}
              </h3>
            </div>

            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedStudent?.id === student.id
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
                onClick={() => {
                  setSelectedStudent(student);
                  if (map.current) {
                    map.current.flyTo({
                      center: [student.home_longitude, student.home_latitude],
                      zoom: 15,
                    });
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👨‍🎓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {student.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {student.email}
                    </p>
                    {student.phone && (
                      <p className="text-sm text-gray-600">{student.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {student.home_address}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                No students found with home addresses
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div
              ref={mapContainer}
              className="rounded-lg shadow-lg"
              style={{ height: "800px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
