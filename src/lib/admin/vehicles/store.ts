import type { Vehicle, VehicleFilters, VehicleStatus, VehicleType } from "./types";


const sample: Vehicle[] = [
{
id: "1",
plateNo: "ABC-1234",
code: "BUS-01",
brand: "Isuzu",
model: "LV123",
type: "Bus",
capacity: 45,
status: "active",
odometerKm: 102345,
lastServiceISO: "2025-08-10",
notes: "",
createdAt: "2025-08-01",
updatedAt: "2025-09-01",
},
];


function matches(v: Vehicle, f: VehicleFilters) {
const s = (f.search ?? "").toLowerCase();
const okSearch = !s || [v.plateNo, v.code, v.brand, v.model].some(x => x.toLowerCase().includes(s));
const okType = !f.type || v.type === f.type;
const okStatus = !f.status || v.status === f.status;
return okSearch && okType && okStatus;
}


export const VehiclesRepo = {
constants: {
types: ["Bus", "Van", "Car", "SUV", "Motorcycle"] as readonly VehicleType[],
statuses: ["active", "maintenance", "inactive"] as readonly VehicleStatus[],
},
list(filters: VehicleFilters = {}) {
return sample.filter(v => matches(v, filters));
},
get(id: string) {
return sample.find(v => v.id === id) ?? null;
},
create(data: Omit<Vehicle, "id"|"createdAt"|"updatedAt">) {
const now = new Date().toISOString();
const v: Vehicle = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now } as Vehicle;
sample.push(v);
return v.id;
},
update(id: string, patch: Partial<Vehicle>) {
const i = sample.findIndex(v => v.id === id);
if (i >= 0) sample[i] = { ...sample[i], ...patch, updatedAt: new Date().toISOString() };
},
remove(id: string) {
const i = sample.findIndex(v => v.id === id);
if (i >= 0) sample.splice(i, 1);
},
};