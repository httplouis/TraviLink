"use client";
import UpcomingTablesUI from "../ui/UpcomingTablesUI";
export default function UpcomingTables() {
  const make = (n:number) => Array.from({length:n}).map((_,i)=>({
    dept:["Hans / CCMS","HR / MAIN","ENG / ME","Registrar"][i%4],
    purpose:["Seminar","Campus tour","Field trip","Docs run"][i%4],
    date:["2025-12-25","2025-12-28","2026-01-10","2026-01-12"][i%4],
    location:["Tagaytay","MSEUF Lucena","Batangas","City Hall"][i%4],
    vehicle:["Bus","Van","Bus","Car"][i%4],
    status:["Approved","Pending","Assigned","Pending"][i%4],
  }));
  return <UpcomingTablesUI schedules={make(8)} approvals={make(4)} maintenance={make(3)} />;
}
