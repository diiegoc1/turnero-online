const servicios = [
    {
        id: 1,
        tipo: "Corte de pelo",
        precio: 12000
    },
    {
        id: 2,
        tipo: "Color",
        precio: 14000
    },
    {
        id: 3,
        tipo: "Alisado",
        precio: 17500
    },
    {
        id: 4,
        tipo: "Corte de barba",
        precio: 6000
    }
]

let turnos = JSON.parse(localStorage.getItem('turnos')) || [];