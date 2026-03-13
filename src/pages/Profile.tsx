import React from 'react';

export default function Profile() {
  // In a real app, this would be fetched from a database
  const user = {
    name: "Prof. R.",
    email: "kodjomahulolorandolphe@gmail.com",
    school: "Lycée Technique"
  };

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl text-edu-black mb-6">Mon Profil</h1>
      <div className="bg-white p-6 rounded-[2px] shadow-sm border border-edu-light/50 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-edu-dark">Nom</label>
            <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-edu-dark">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-edu-dark">Établissement</label>
            <p className="text-lg">{user.school}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
