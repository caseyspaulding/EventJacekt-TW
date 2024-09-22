import { createContext, ReactNode, useState, Dispatch, SetStateAction, useContext } from "react";
import { ChevronDown, ChevronFirst, ChevronLast, ChevronRight, MoreVertical } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the type for the context value
interface SidebarContextProps
{
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>; // Correctly typed setState function
}

// Sidebar Context with default values
const SidebarContext = createContext<SidebarContextProps>( {
  expanded: true,
  setExpanded: () => { }, // Placeholder function, will be replaced by useState
} );

interface SidebarProps
{
  children: ReactNode;
}

export default function Sidebar ( { children }: SidebarProps )
{
  const [ expanded, setExpanded ] = useState( true );
  return (
    <SidebarContext.Provider value={ { expanded, setExpanded } }>
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-gray-50 border-r shadow-sm">
          <div className="px-4 py-2 pb-2 flex justify-between items-center">
            <img
              src="/images/Logo_Icon.webp"
              className={ `overflow-hidden transition-all ${ expanded ? "w-10" : "w-0" }` }
              alt="Logo"
            />
            <button
              onClick={ () => setExpanded( ( curr ) => !curr ) }
              className=" py-1 rounded-3xl bg-gray-50 hover:bg-gray-100"
            >
              { expanded ? <ChevronFirst /> : <ChevronLast /> }
            </button>
          </div>
          <div className="border-t flex px-3 py-3">
            <img src="/images/avatars/user_avatar_default.png" className="w-10 h-10 rounded-md" />
            <div
              className={ `flex justify-between items-center overflow-hidden transition-all ${ expanded ? "w-52 ml-3" : "w-0"
                } ` }
            >
              <div className="leading-4">
                <h4 className="font-semibold">Casey</h4>
                <span className="text-xs text-gray-600">casey@me.com</span>
              </div>
              <MoreVertical size={ 20 } />
            </div>
          </div>

          <ul className="flex-1 px-1">{ children }</ul>

          
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

interface SidebarItemProps
{
  icon: ReactNode;
  text: string;
  active: boolean;
  alert?: boolean; // Optional prop
  href: string; // URL for navigation
  submenu?: { text: string; href: string }[]; // Submenu array
}

export function SidebarItem ( { icon, text, active, alert, href, submenu }: SidebarItemProps )
{
  const pathname = usePathname();
  const { expanded, setExpanded } = useContext( SidebarContext ); // Access SidebarContext here
  const isActive = pathname === href; // Check if the current route matches the href
  const [ isSubmenuOpen, setIsSubmenuOpen ] = useState( false );

  // Toggle submenu on click
  const toggleSubmenu = () =>
  {
    setIsSubmenuOpen( !isSubmenuOpen );
    // Expand the sidebar if it's collapsed
    if ( !expanded )
    {
      setExpanded( true );
    }
  };

  return (
    <>
      <li
        className={ `relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${ isActive ? "bg-gradient-to-tr from-blue-200 to-indigo-100 text-blue-800" : "hover:bg-yellow-50 text-gray-600"
          }` }
      >
        {/* Main Link using Next.js Link component */ }
        <Link href={ href } className="flex items-center w-full">
          {/* Icon */ }
          { icon }

          {/* Text that is shown when expanded */ }
          <span className={ `overflow-hidden transition-all ${ expanded ? "w-52 ml-3" : "w-0" }` }>
            { text }
          </span>

          {/* Alert (small circle) if present */ }
          { alert && (
            <div className={ `absolute right-2 w-2 h-2 rounded bg-yellow-400 ${ expanded ? "" : "top-2" }` }></div>
          ) }
        </Link>

        {/* Submenu Toggle Icon (Plus/Minus or Chevron) */ }
        { submenu && (
          <span className="ml-auto" onClick={ toggleSubmenu }>
            { isSubmenuOpen ? <ChevronDown size={ 16 } /> : <ChevronRight size={ 16 } /> }
          </span>
        ) }

        {/* Tooltip when sidebar is collapsed */ }
        { !expanded && (
          <div className={ `absolute left-full rounded-md px-2 py-1 ml-6 bg-yellow-100 text-blue-800 text-sm invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0` }>
            { text }
          </div>
        ) }
      </li>

      {/* Submenu Items (if submenu is available and open) */ }
      { submenu && isSubmenuOpen && (
        <ul className={ `pl-10 transition-all duration-300 ease-in-out ${ expanded ? "block" : "absolute left-full bg-white border rounded-md shadow-md" }` }>
          { submenu.map( ( subItem, index ) => (
            <li key={ index } className="py-1 text-gray-600 hover:bg-gray-100 rounded-md">
              {/* Submenu links also using Next.js Link component */ }
              <Link href={ subItem.href } className="block px-3">
                { subItem.text }
              </Link>
            </li>
          ) ) }
        </ul>
      ) }
    </>
  );
}