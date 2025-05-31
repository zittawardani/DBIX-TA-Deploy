import Alerts from '@/components/ui/alerts';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeftRightIcon, Bell, BookCheckIcon, CircleUser, FoldersIcon, Home, ListChecks, LogsIcon, Menu, Package2, Search, Users } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Appbar = () => {
  const { pathname } = useRouter()
  const [sheetView, setSheetView] = useState(false)

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-primary-foreground px-4 lg:h-[60px] lg:px-6 sticky top-0 z-[9]">
      <Sheet open={sheetView} onOpenChange={setSheetView}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => setSheetView(false)}
            >
              <Package2 className="h-6 w-6" />
              <span className="">E-Shop DBI</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/admin/dashboard' ? 'text-foreground bg-muted' : 'text-muted-foreground'} hover:text-foreground`}
              onClick={() => setSheetView(false)}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/admin/products' || pathname === '/admin/products/add' || pathname === '/admin/products/details/[id]' || pathname === '/admin/products/edit/[id]' ? 'text-foreground bg-muted' : 'text-muted-foreground'} hover:text-foreground`}
              onClick={() => setSheetView(false)}
            >
              <FoldersIcon className="h-5 w-5" />
              Products
            </Link>
            <Link
              href="/admin/order"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/admin/order' ? 'text-foreground bg-muted' : 'text-muted-foreground'} hover:text-foreground`}
              onClick={() => setSheetView(false)}
            >
              <LogsIcon className="h-5 w-5" />
              Order
            </Link>
            <Link
              href="/admin/discussion"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/admin/discussion' ? 'text-foreground bg-muted' : 'text-muted-foreground'} hover:text-foreground`}
              onClick={() => setSheetView(false)}
            >
              <Users className="h-5 w-5" />
              Disscussion
            </Link>
            <Link
              href="/admin/contract"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/admin/contract' ? 'text-foreground bg-muted' : 'text-muted-foreground'} hover:text-foreground`}
              onClick={() => setSheetView(false)}
            >
              <BookCheckIcon className="h-5 w-5" />
              Contract 
            </Link>
            <Link
              href="/admin/monitoring"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/admin/monitoring' ? 'text-foreground bg-muted' : 'text-muted-foreground'} hover:text-foreground`}
              onClick={() => setSheetView(false)}
            >
              <ListChecks className="h-5 w-5" />
              Monitoring Progress 
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <Alerts btn='Signout' desc='this can be changed!' ok={() => {
            signOut()
          }} />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Appbar;