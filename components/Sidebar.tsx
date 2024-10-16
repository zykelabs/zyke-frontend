import { Button } from "@/components/ui/button"

interface SidebarProps {
  templates: { name: string }[];
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  handleTemplateClick: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ templates, isSidebarOpen, toggleSidebar, handleTemplateClick }) => {
  return (
    <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-width duration-300 bg-gray-900 p-6 flex flex-col justify-between border-r border-gray-800`}>
      <Button onClick={toggleSidebar} className="mb-4">
        {isSidebarOpen ? 'Collapse' : 'Expand'}
      </Button>
      {isSidebarOpen && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-400">My Designs</h2>
          <ul className="space-y-2">
            {templates.map((template, index) => (
              <li key={index} onClick={() => handleTemplateClick(template.name)} className="cursor-pointer hover:text-blue-400 transition-colors">
                {template.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

export default Sidebar;
