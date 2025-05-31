import Link from "next/link";
import {
  ArrowLeftRightIcon, BookCheckIcon, FoldersIcon,
  Home, ListChecks, LogsIcon, Package2, Users
} from "lucide-react";
import { useRouter } from "next/router";

const Sidebar = () => {
  const { pathname } = useRouter()

  return (
    <div className="hidden border-r bg-muted/40 md:block w-full h-full">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">E-Shop DBI</span>
          </Link>

        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/admin/dashboard' ? 'text-foreground bg-muted' : 'text-muted-foreground'} transition-all hover:text-primary`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/admin/products' || pathname === '/admin/products/add' || pathname === '/admin/products/details/[id]' || pathname === '/admin/products/edit/[id]' ? 'text-foreground bg-muted' : 'text-muted-foreground'} transition-all hover:text-primary`}
            >
              <FoldersIcon className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="/admin/order"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/admin/order' ? 'text-foreground bg-muted' : 'text-muted-foreground'} transition-all hover:text-primary`}
            >
              <LogsIcon className="h-4 w-4" />
              Order
            </Link>
            <Link
              href="/admin/discussion"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/admin/discussion' ? 'text-foreground bg-muted' : 'text-muted-foreground'} transition-all hover:text-primary`}
            >
              <Users className="h-4 w-4" />
              Disscusion
            </Link>
            <Link
              href="/admin/contract"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/admin/contract' ? 'text-foreground bg-muted' : 'text-muted-foreground'} transition-all hover:text-primary`}
            >
              <BookCheckIcon className="h-4 w-4" />
              Contract
            </Link>
            <Link
              href="/admin/monitoring"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/admin/monitoring' ? 'text-foreground bg-muted' : 'text-muted-foreground'} transition-all hover:text-primary`}
            >
              <ListChecks className="h-4 w-4" />
              Monitoring Progress
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
