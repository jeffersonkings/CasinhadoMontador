import React from "react";
import "./ServiceCard.css";

export default function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <h3 className="service-title">{service.title}</h3>
      <p className="service-description">{service.description}</p>
      <span className={`service-status ${service.status === "Disponível" ? "available" : "unavailable"}`}>
        {service.status}
      </span>
    </div>
  );
}

