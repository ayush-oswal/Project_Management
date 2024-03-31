

import React from 'react';

interface ProjectCardProps {
  id: string;
  title: string;
  status: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, status }) => {
  let color = '';
  switch (status) {
    case 'Not Started':
      color = 'bg-red-500';
      break;
    case 'In Progress':
      color = 'bg-yellow-500';
      break;
    case 'Completed':
      color = 'bg-green-500';
      break;
    default:
      color = 'bg-gray-200';
      break;
  }

  return (
    <div className={`rounded-md ${color}`} >
      <div className="p-4 mb-4 h-36 w-48 text-white rounded-md shadow-md border border-gray-300">
        <h2 className="text-3xl font-semibold">{title}</h2>
        <p className="text-xs">Status: {status}</p>
      </div>
    </div> 
  );
};

export default ProjectCard;
