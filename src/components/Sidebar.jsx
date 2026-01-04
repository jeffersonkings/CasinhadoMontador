import React from "react";

export default function Sidebar({ links }) {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <a href={link.href} className="block p-2 hover:bg-blue-200 rounded">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
