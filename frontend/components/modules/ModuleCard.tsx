import { Module } from "@/types/module"

interface ModuleCardProps {
 module: Module;
}

export default function ModuleCard( {module}: ModuleCardProps) {
  return (
    <div className="block mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold">
        {module.title}
      </h2>

      <div className="mt-2">
        Module Topics will go here
      </div>
    </div>
  )
}