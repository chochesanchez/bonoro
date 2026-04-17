import React, { useState, useEffect, useRef } from "react";

// ── Ciudades disponibles ──────────────────────────────────────────────────
const CITIES = [
  { id:"mty", name:"Monterrey", state:"Nuevo León", emoji:"🏔️",
    mapBounds:{ minLat:25.63, maxLat:25.71, minLng:-100.39, maxLng:-100.27 },
    mapLabel:"Monterrey" },
  { id:"cdmx", name:"Ciudad de México", state:"CDMX", emoji:"🏙️",
    mapBounds:{ minLat:19.30, maxLat:19.53, minLng:-99.22, maxLng:-98.98 },
    mapLabel:"Ciudad de México" },
  { id:"gdl", name:"Guadalajara", state:"Jalisco", emoji:"🌵",
    mapBounds:{ minLat:20.61, maxLat:20.74, minLng:-103.44, maxLng:-103.28 },
    mapLabel:"Guadalajara" },
  { id:"can", name:"Cancún", state:"Quintana Roo", emoji:"🏖️",
    mapBounds:{ minLat:21.08, maxLat:21.22, minLng:-86.90, maxLng:-86.76 },
    mapLabel:"Cancún" },
  { id:"pue", name:"Puebla", state:"Puebla", emoji:"🏯",
    mapBounds:{ minLat:18.98, maxLat:19.10, minLng:-98.26, maxLng:-98.14 },
    mapLabel:"Puebla" },
  { id:"tij", name:"Tijuana", state:"Baja California", emoji:"🌊",
    mapBounds:{ minLat:32.46, maxLat:32.56, minLng:-117.09, maxLng:-116.92 },
    mapLabel:"Tijuana" },
];

const SEED = [
  // ── Monterrey ──
  { id:1, city:"mty", name:"Pizza Napoli", category:"Pizza", address:"Av. Constitución 450, Monterrey", hours:"12:00 – 23:00", rating:4.8, lat:25.6866, lng:-100.3161, coverColor:"#FF6B35", emoji:"🍕", promos:[{
    _id:1, type:"2x1", label:"2×1 en cualquier pizza mediana",
    anyProduct:true, productScope:"cualquier pizza mediana (30 cm)",
    price:"", condition:"Ambas pizzas deben ser del mismo tamaño. No aplica con otras promos.",
    days:["Lun","Mar","Mié","Jue"], timeFrom:"12:00", timeTo:"22:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:2, city:"mty", name:"Sushi Kai", category:"Sushi", address:"Calzada del Valle 220, San Pedro", hours:"13:00 – 22:30", rating:4.9, lat:25.6572, lng:-100.3696, coverColor:"#00B4D8", emoji:"🍣", promos:[{
    _id:2, type:"50%off", label:"50% OFF en Tuna Roll x8",
    anyProduct:false, scope50:"product",
    items:[{name:"Tuna Roll", size:"x8 piezas", price:"220"}],
    condition:"Solo en consumo en mesa. No aplica para llevar.", days:["Mar","Mié","Jue"], timeFrom:"13:00", timeTo:"20:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:3, city:"mty", name:"Burger Boom", category:"Hamburguesas", address:"Av. Garza Sada 1200, MTY", hours:"11:00 – 00:00", rating:4.6, lat:25.6450, lng:-100.2900, coverColor:"#F4D03F", emoji:"🍔", promos:[{
    _id:3, type:"bebida_gratis", label:"Refresco gratis con tu combo clásico",
    anyProduct:false,
    items:[{name:"Hamburguesa de pollo clásica", size:"individual", price:"139"},{name:"Papas normales", size:"porción regular", price:"45"}],
    extraProduct:"Refresco 400ml (cualquier sabor)", extraPrice:"35",
    condition:"Una bebida por persona. No aplica para delivery.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"11:00", timeTo:"22:00"
  }]},
  { id:4, city:"mty", name:"Tacos El Rey", category:"Tacos", address:"Calle Morelos 89, Centro", hours:"08:00 – 20:00", rating:4.7, lat:25.6700, lng:-100.3080, coverColor:"#2ECC71", emoji:"🌮", promos:[{
    _id:4, type:"2x1", label:"2×1 en Tacos al Pastor",
    anyProduct:false,
    items:[{name:"Taco al Pastor", size:"con piña y cilantro", price:"28"}],
    condition:"El de menor precio es el gratis. Mínimo 2 tacos del mismo tipo.", days:["Lun","Mar","Mié","Jue","Vie","Sáb"], timeFrom:"08:00", timeTo:"17:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:5, city:"mty", name:"Ramen House", category:"Ramen", address:"Av. Vasconcelos 340, San Pedro", hours:"12:00 – 22:00", rating:4.9, lat:25.6600, lng:-100.3750, coverColor:"#E74C3C", emoji:"🍜", promos:[{
    _id:5, type:"50%off", label:"50% OFF en Ramen Tonkotsu",
    anyProduct:false, scope50:"product",
    items:[{name:"Ramen Tonkotsu", size:"tazón regular (500ml)", price:"195"}],
    condition:"Solo de lunes a jueves. No aplica doble caldo ni add-ons.", days:["Lun","Mar","Mié","Jue"], timeFrom:"12:00", timeTo:"18:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:6, city:"mty", name:"The Grill House", category:"Carnes", address:"Blvd. Roble 500, San Pedro", hours:"13:00 – 23:30", rating:4.8, lat:25.6520, lng:-100.3600, coverColor:"#8E44AD", emoji:"🥩", promos:[{
    _id:6, type:"bebida_gratis", label:"Copa de vino gratis con tu Ribeye",
    anyProduct:false,
    items:[{name:"Ribeye", size:"400g término a elegir", price:"580"}],
    extraProduct:"Copa de vino tinto (150ml, Cabernet Sauvignon)", extraPrice:"120",
    condition:"Una copa por persona. Solo en consumo en mesa. No incluye botella.", days:["Jue","Vie","Sáb"], timeFrom:"19:00", timeTo:"23:00"
  }]},
  { id:7, city:"mty", name:"Café Bohemia", category:"Cafetería", address:"Av. Hidalgo 120, Barrio Antiguo", hours:"07:00 – 21:00", rating:4.5, lat:25.6720, lng:-100.3200, coverColor:"#D35400", emoji:"☕", promos:[{
    _id:7, type:"descuento_especial", label:"Desayuno completo con postre incluido",
    anyProduct:false,
    items:[{name:"Croissant de mantequilla", size:"individual", price:"65"},{name:"Café americano", size:"240ml", price:"45"}],
    extraPrice:"89", extraProduct:"Postre a elegir: pastel de chocolate o flan napolitano",
    condition:"Solo en desayuno. No aplica modificaciones al croissant.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"07:00", timeTo:"12:00"
  }]},
  { id:8, city:"mty", name:"La Trattoria", category:"Pasta", address:"Calle Hidalgo 780, Monterrey", hours:"13:00 – 23:00", rating:4.7, lat:25.6800, lng:-100.3100, coverColor:"#27AE60", emoji:"🍝", promos:[{
    _id:8, type:"2x1", label:"2×1 en Spaghetti Carbonara",
    anyProduct:false,
    items:[{name:"Spaghetti Carbonara", size:"plato individual", price:"165"}],
    condition:"Ambos platos iguales. No aplica orden para llevar ni modificaciones.", days:["Mar","Mié"], timeFrom:"13:00", timeTo:"21:00",
    extraProduct:"", extraPrice:""
  }]},
  // ── CDMX ──
  { id:9, city:"cdmx", name:"Taquería El Califa", category:"Tacos", address:"Álvaro Obregón 58, Roma Norte", hours:"09:00 – 02:00", rating:4.9, lat:19.4180, lng:-99.1630, coverColor:"#E74C3C", emoji:"🌮", promos:[{
    _id:9, type:"2x1", label:"2×1 en Tacos de Canasta",
    anyProduct:true, productScope:"cualquier taco de canasta (frijol, papa o chicharrón)",
    condition:"Mínimo 2 tacos del mismo relleno.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"09:00", timeTo:"15:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:10, city:"cdmx", name:"Sushi Roll Polanco", category:"Sushi", address:"Masaryk 134, Polanco", hours:"13:00 – 23:00", rating:4.7, lat:19.4320, lng:-99.1890, coverColor:"#00B4D8", emoji:"🍣", promos:[{
    _id:10, type:"50%off", label:"50% OFF en Dragon Roll",
    anyProduct:false, scope50:"product",
    items:[{name:"Dragon Roll", size:"x8 piezas", price:"285"}],
    condition:"Solo en consumo en mesa. No aplica fines de semana.", days:["Lun","Mar","Mié","Jue"], timeFrom:"13:00", timeTo:"18:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:11, city:"cdmx", name:"Burguesa Condesa", category:"Hamburguesas", address:"Tamaulipas 66, Condesa", hours:"12:00 – 23:30", rating:4.6, lat:19.4110, lng:-99.1750, coverColor:"#F39C12", emoji:"🍔", promos:[{
    _id:11, type:"bebida_gratis", label:"Refresco gratis con Smash Burger Doble",
    anyProduct:false,
    items:[{name:"Smash Burger Doble", size:"doble carne 120g c/u con queso", price:"175"}],
    extraProduct:"Refresco de lata 355ml (Coca-Cola, Sprite o agua mineral)", extraPrice:"30",
    condition:"Una bebida por persona. No aplica para delivery.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"12:00", timeTo:"20:00"
  }]},
  { id:12, city:"cdmx", name:"Pizzería Bella Roma", category:"Pizza", address:"Orizaba 42, Roma Sur", hours:"14:00 – 00:00", rating:4.8, lat:19.4070, lng:-99.1580, coverColor:"#FF6B35", emoji:"🍕", promos:[{
    _id:12, type:"2x1", label:"2×1 en Pizza Margherita DOC",
    anyProduct:false,
    items:[{name:"Pizza Margherita DOC", size:"mediana 28cm", price:"195"}],
    condition:"Ambas pizzas iguales. No aplica con ingredientes extra.", days:["Mar","Mié","Jue"], timeFrom:"14:00", timeTo:"20:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:13, city:"cdmx", name:"Noodle Bar CDMX", category:"Ramen", address:"Insurgentes Sur 320, Del Valle", hours:"12:00 – 22:00", rating:4.5, lat:19.3780, lng:-99.1600, coverColor:"#8E44AD", emoji:"🍜", promos:[{
    _id:13, type:"descuento_especial", label:"Gyoza gratis con tu Shoyu Ramen",
    anyProduct:false,
    items:[{name:"Shoyu Ramen", size:"tazón regular", price:"175"}],
    extraPrice:"175", extraProduct:"Gyoza de cerdo x5 piezas (val. $85)",
    condition:"Solo en consumo en mesa. No aplica para llevar ni delivery.", days:["Lun","Mar","Mié","Jue"], timeFrom:"12:00", timeTo:"18:00"
  }]},
  // ── Guadalajara ──
  { id:14, city:"gdl", name:"La Chata Tapatía", category:"Tacos", address:"Corona 126, Centro Histórico", hours:"08:00 – 21:00", rating:4.8, lat:20.6735, lng:-103.3440, coverColor:"#E74C3C", emoji:"🌮", promos:[{
    _id:14, type:"2x1", label:"2×1 en Tacos de Birria",
    anyProduct:false,
    items:[{name:"Taco de Birria de Res", size:"con consomé y cebolla", price:"42"}],
    condition:"Mínimo 2 tacos del mismo tipo. No aplica con orden para llevar.", days:["Sáb","Dom"], timeFrom:"08:00", timeTo:"14:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:15, city:"gdl", name:"Osaka GDL", category:"Sushi", address:"Av. Patria 330, Zapopan", hours:"13:30 – 23:00", rating:4.9, lat:20.7020, lng:-103.3900, coverColor:"#2ECC71", emoji:"🍱", promos:[{
    _id:15, type:"50%off", label:"50% OFF en Bento Ejecutivo",
    anyProduct:false, scope50:"product",
    items:[{name:"Bento Ejecutivo", size:"incluye sopa miso + roll x6 + onigiri", price:"265"}],
    condition:"Solo de lunes a viernes. No aplica fines de semana ni días festivos.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"13:30", timeTo:"17:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:16, city:"gdl", name:"Terraza Pizza GDL", category:"Pizza", address:"Av. Chapultepec 48, Americana", hours:"13:00 – 00:00", rating:4.7, lat:20.6760, lng:-103.3780, coverColor:"#FF6B35", emoji:"🍕", promos:[{
    _id:16, type:"bebida_gratis", label:"Cerveza gratis con Pizza Grande",
    anyProduct:true, productScope:"cualquier pizza grande (40cm)",
    extraProduct:"Cerveza artesanal 355ml (Clara o Oscura)", extraPrice:"65",
    condition:"Una cerveza por pizza ordenada. Solo en terraza. Mayores de edad.", days:["Vie","Sáb","Dom"], timeFrom:"14:00", timeTo:"23:00"
  }]},
  { id:17, city:"gdl", name:"Steak House GDL", category:"Carnes", address:"López Cotilla 1234, Lafayette", hours:"14:00 – 23:00", rating:4.8, lat:20.6640, lng:-103.3820, coverColor:"#8E44AD", emoji:"🥩", promos:[{
    _id:17, type:"descuento_especial", label:"Postre gratis con tu New York",
    anyProduct:false,
    items:[{name:"New York", size:"300g término a elegir", price:"420"}],
    extraPrice:"420", extraProduct:"Postre a elegir: cheesecake de frambuesa o brownie con helado (val. $95)",
    condition:"Un postre por corte ordenado. Solo en consumo en mesa.", days:["Lun","Mar","Mié","Jue"], timeFrom:"14:00", timeTo:"21:00"
  }]},
  // ── Cancún ──
  { id:18, city:"can", name:"Mariscos El Puerto", category:"Mariscos", address:"Av. Yaxchilán 31, SM 22", hours:"10:00 – 22:00", rating:4.9, lat:21.1619, lng:-86.8515, coverColor:"#00B4D8", emoji:"🦞", promos:[{
    _id:18, type:"2x1", label:"2×1 en Ceviche de Camarón",
    anyProduct:false,
    items:[{name:"Ceviche de Camarón", size:"plato individual (300g)", price:"185"}],
    condition:"Ambos platos del mismo tipo. No aplica tostadas extra.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"10:00", timeTo:"17:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:19, city:"can", name:"Pizza del Caribe", category:"Pizza", address:"Blvd. Kukulcán km 9, Zona H.", hours:"12:00 – 00:00", rating:4.6, lat:21.1350, lng:-86.7780, coverColor:"#F4D03F", emoji:"🍕", promos:[{
    _id:19, type:"bebida_gratis", label:"Piña Colada gratis con Pizza Tropical",
    anyProduct:false,
    items:[{name:"Pizza Tropical", size:"mediana 30cm con piña y jamón", price:"210"}],
    extraProduct:"Piña Colada sin alcohol 350ml", extraPrice:"75",
    condition:"Una Piña Colada por pizza. Solo en terraza frente al mar.", days:["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"], timeFrom:"12:00", timeTo:"22:00"
  }]},
  { id:20, city:"can", name:"Tacos Kaan", category:"Tacos", address:"Av. Tulum 87, Centro", hours:"08:00 – 18:00", rating:4.7, lat:21.1680, lng:-86.8450, coverColor:"#E74C3C", emoji:"🌮", promos:[{
    _id:20, type:"50%off", label:"50% OFF en Taco Cochinita Pibil",
    anyProduct:false, scope50:"product",
    items:[{name:"Taco Cochinita Pibil", size:"con cebolla morada encurtida", price:"38"}],
    condition:"Mínimo 3 tacos. No aplica orden para llevar.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"08:00", timeTo:"14:00",
    extraProduct:"", extraPrice:""
  }]},
  // ── Puebla ──
  { id:21, city:"pue", name:"Fonda de Mole", category:"Tacos", address:"6 Oriente 16, Centro Histórico", hours:"09:00 – 20:00", rating:4.9, lat:19.0430, lng:-98.1980, coverColor:"#D35400", emoji:"🌮", promos:[{
    _id:21, type:"2x1", label:"2×1 en Enmoladas Poblanas",
    anyProduct:false,
    items:[{name:"Enmoladas Poblanas de Pollo", size:"orden de 3 piezas", price:"115"}],
    condition:"Ambas órdenes del mismo tipo. No aplica para llevar.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"09:00", timeTo:"17:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:22, city:"pue", name:"Pizzería Angelópolis", category:"Pizza", address:"Blvd. Atlixcáyotl 2, Reserva T.", hours:"13:00 – 23:00", rating:4.6, lat:19.0200, lng:-98.2380, coverColor:"#FF6B35", emoji:"🍕", promos:[{
    _id:22, type:"50%off", label:"50% OFF en Pizza de Chorizo Español",
    anyProduct:false, scope50:"product",
    items:[{name:"Pizza Chorizo Español", size:"mediana 30cm", price:"215"}],
    condition:"Solo los martes. No aplica para delivery ni pizza por rebanada.", days:["Mar"], timeFrom:"13:00", timeTo:"22:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:23, city:"pue", name:"Café de la Catedral", category:"Cafetería", address:"Portal Morelos 3, Zócalo", hours:"07:00 – 22:00", rating:4.8, lat:19.0438, lng:-98.1980, coverColor:"#27AE60", emoji:"☕", promos:[{
    _id:23, type:"descuento_especial", label:"Cemita gratis con tu Café de Olla",
    anyProduct:false,
    items:[{name:"Café de Olla", size:"taza grande 300ml", price:"55"}],
    extraPrice:"55", extraProduct:"Cemita de milanesa chica (val. $65)",
    condition:"Solo en desayuno. Una cemita por café ordenado.", days:["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"], timeFrom:"07:00", timeTo:"12:00"
  }]},
  // ── Tijuana ──
  { id:24, city:"tij", name:"Tacos El Franc", category:"Tacos", address:"Av. Revolución 1388, Centro", hours:"09:00 – 01:00", rating:4.9, lat:32.5060, lng:-117.0190, coverColor:"#E74C3C", emoji:"🌮", promos:[{
    _id:24, type:"2x1", label:"2×1 en Tacos de Adobada",
    anyProduct:false,
    items:[{name:"Taco de Adobada", size:"con cebolla, cilantro y piña", price:"35"}],
    condition:"Mínimo 2 tacos del mismo tipo. No aplica con bebidas ni extras.", days:["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"], timeFrom:"09:00", timeTo:"18:00",
    extraProduct:"", extraPrice:""
  }]},
  { id:25, city:"tij", name:"Caesar's Gastro", category:"Pasta", address:"Av. Revolución 1059, Zona Centro", hours:"12:00 – 23:00", rating:4.8, lat:32.5090, lng:-117.0240, coverColor:"#2ECC71", emoji:"🍝", promos:[{
    _id:25, type:"descuento_especial", label:"Ensalada César gratis con tu pasta",
    anyProduct:false,
    items:[{name:"Pasta al César", size:"plato individual", price:"195"}],
    extraPrice:"195", extraProduct:"Ensalada César individual (val. $110)",
    condition:"Solo en consumo en mesa. No aplica para llevar.", days:["Lun","Mar","Mié","Jue","Vie"], timeFrom:"12:00", timeTo:"20:00"
  }]},
  { id:26, city:"tij", name:"Mariscos El Mazateño", category:"Mariscos", address:"Blvd. Agua Caliente 2800", hours:"10:00 – 21:00", rating:4.7, lat:32.5010, lng:-116.9980, coverColor:"#00B4D8", emoji:"🦞", promos:[{
    _id:26, type:"bebida_gratis", label:"Michelada gratis con Tostada de Marlín",
    anyProduct:false,
    items:[{name:"Tostada de Marlín", size:"individual con aguacate y chipotle", price:"95"}],
    extraProduct:"Michelada 500ml (clara o preparada)", extraPrice:"55",
    condition:"Una michelada por tostada. Solo en consumo en local.", days:["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"], timeFrom:"10:00", timeTo:"20:00"
  }]},
];

const PROMO_TYPES = [
  { id:"2x1",               label:"2×1",                  icon:"✌️",  desc:"Lleva dos, paga uno" },
  { id:"50%off",            label:"50% OFF",               icon:"🏷️",  desc:"Mitad de precio" },
  { id:"bebida_gratis",     label:"Bebida Gratis",         icon:"🥤",  desc:"Con tu orden" },
  { id:"descuento_especial",label:"Especial del Día",      icon:"⭐",  desc:"Promos únicas" },
  { id:"postre_gratis",     label:"Postre Gratis",         icon:"🍰",  desc:"Con tu orden principal" },
  { id:"happy_hour",        label:"Happy Hour",            icon:"🍻",  desc:"Bebidas a precio especial" },
  { id:"cumpleanos",        label:"Cumpleaños",            icon:"🎂",  desc:"Regalo especial en tu día" },
  { id:"descuento_grupo",   label:"Descuento por Grupo",   icon:"👥",  desc:"Mientras más, mejor precio" },
  { id:"descuento_estudiante", label:"Descuento Estudiante/Maestro", icon:"🎓", desc:"Con credencial vigente" },
];
const CATS   = ["Pizza","Sushi","Hamburguesas","Tacos","Ramen","Carnes","Cafetería","Pasta","Mariscos","Vegano","Postres","Otro"];
const CICONS = ["🍕","🍣","🍔","🌮","🍜","🥩","☕","🍝","🦞","🥗","🍰","🍽️"];
const COLORS = ["#FF6B35","#00B4D8","#F4D03F","#2ECC71","#E74C3C","#8E44AD","#D35400","#27AE60","#1ABC9C","#3498DB","#E91E63","#607D8B"];
const EMOJIS = ["🍕","🍣","🍔","🌮","🍜","🥩","☕","🍝","🌯","🥗","🍰","🍽️","🫕","🥘","🍱","🫔"];
const BADGE  = {
  "2x1":                {bg:"#FFF3CD",text:"#856404",border:"#FFCD39"},
  "50%off":             {bg:"#D1ECF1",text:"#0C5460",border:"#17A2B8"},
  "bebida_gratis":      {bg:"#D4EDDA",text:"#155724",border:"#28A745"},
  "descuento_especial": {bg:"#F8D7DA",text:"#721C24",border:"#DC3545"},
  "postre_gratis":      {bg:"#FCE4EC",text:"#880E4F",border:"#F48FB1"},
  "happy_hour":         {bg:"#EDE7F6",text:"#4A148C",border:"#CE93D8"},
  "cumpleanos":         {bg:"#FFF8E1",text:"#F57F17",border:"#FFD54F"},
  "descuento_grupo":    {bg:"#E3F2FD",text:"#0D47A1",border:"#90CAF9"},
  "descuento_estudiante":{bg:"#E8F5E9",text:"#1B5E20",border:"#A5D6A7"},
};

const iS = { background:"#F8F9FA",border:"2px solid #F0F0F0",borderRadius:14,padding:"13px 16px",fontSize:14,fontWeight:600,color:"#1A1A2E",outline:"none",width:"100%",fontFamily:"inherit" };
const bP = { background:"linear-gradient(135deg,#FF6B35,#FF3A6E)",color:"#fff",border:"none",borderRadius:14,padding:"15px 0",fontSize:15,fontWeight:800,cursor:"pointer",width:"100%",boxShadow:"0 6px 20px rgba(255,107,53,.35)" };
const bS = { background:"#fff",color:"#1A1A2E",border:"2px solid #E0E0E0",borderRadius:14,padding:"13px 0",fontSize:14,fontWeight:700,cursor:"pointer",width:"100%" };
const bB = { background:"none",border:"none",cursor:"pointer",color:"#666",fontSize:14,fontWeight:600,marginBottom:20,padding:0,display:"flex",alignItems:"center",gap:6 };

// ── Fair shuffle ─────────────────────────────────────────────────────────────
// Seed = slot de 30 minutos → todos los usuarios ven el mismo orden en ese slot,
// pero cambia cada 30 min de forma equitativa para todos los restaurantes.
function getSlotSeed() {
  const now = new Date();
  return Math.floor((now.getTime()) / (30 * 60 * 1000)); // cambia cada 30 min
}
function seededRandom(seed) {
  // Simple mulberry32
  let s = seed >>> 0;
  return () => { s += 0x6D2B79F5; let t = Math.imul(s ^ s >>> 15, 1 | s); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function fairShuffle(arr, extraSeed = 0) {
  const rng = seededRandom(getSlotSeed() * 31 + extraSeed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
// Convierte categoría + tipo de promo en un extraSeed numérico reproducible
function strSeed(str) { return [...str].reduce((a, c) => a + c.charCodeAt(0), 0); }

function loadDB() { try { const r=localStorage.getItem("pe-v2"); return Promise.resolve(r?JSON.parse(r):SEED); } catch { return Promise.resolve(SEED); } }
function saveDB(list) { try { localStorage.setItem("pe-v2",JSON.stringify(list)); } catch {} return Promise.resolve(); }
async function aiLabel(name,cat,type,product) {
  try {
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:80,messages:[{role:"user",content:`Genera texto corto y atractivo (máximo 7 palabras) para promo de restaurante.\nRestaurante: ${name}\nCategoría: ${cat}\nTipo: ${type}\nProducto: ${product}\nResponde SOLO el texto, sin comillas.`}]})});
    const d=await res.json(); return d.content?.[0]?.text?.trim()||null;
  } catch { return null; }
}

function Badge({type,label}) {
  const c=BADGE[type]||BADGE.descuento_especial;
  return <span style={{background:c.bg,color:c.text,border:`1.5px solid ${c.border}`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,letterSpacing:.3,whiteSpace:"nowrap"}}>{label}</span>;
}

function PromoCard({p, coverColor, emoji}) {
  if(!p) return null;
  const pt = PROMO_TYPES.find(x=>x.id===p.type);
  const items = (p.items||[]).filter(it=>it.name);
  const total = items.reduce((s,it)=>s+(Number(it.price)||0),0);
  const promoFinal = p.type==="50%off"&&p.scope50!=="total" ? Math.round(total/2)
    : p.type==="descuento_especial"&&p.extraPrice ? Number(p.extraPrice)
    : null;

  return (
    <div style={{background:"#fff",borderRadius:20,padding:20,marginBottom:14,border:`2px dashed ${coverColor}`,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
      {/* Header badge */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{width:40,height:40,borderRadius:12,background:`${coverColor}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{pt?.icon}</div>
        <div>
          <div style={{fontWeight:900,fontSize:16,color:"#1A1A2E"}}>{p.label}</div>
          <Badge type={p.type} label={pt?.label||p.type}/>
        </div>
      </div>

      {/* Productos */}
      {p.anyProduct
        ? <div style={{background:"#F8F9FA",borderRadius:12,padding:"10px 14px",marginBottom:10}}>
            <div style={{fontSize:11,color:"#999",fontWeight:800,letterSpacing:.5,marginBottom:4}}>APLICA EN</div>
            <div style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>🔓 {p.productScope}</div>
          </div>
        : items.length>0&&<div style={{background:"#F8F9FA",borderRadius:12,padding:"10px 14px",marginBottom:10}}>
            <div style={{fontSize:11,color:"#999",fontWeight:800,letterSpacing:.5,marginBottom:8}}>QUÉ INCLUYE</div>
            {items.map((it,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:i<items.length-1?6:0}}>
                <div>
                  <span style={{fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{it.name}</span>
                  {it.size&&<span style={{fontSize:12,color:"#888"}}> · {it.size}</span>}
                </div>
                {it.price&&<span style={{fontSize:13,fontWeight:800,color:"#555"}}>${it.price}</span>}
              </div>
            ))}
          </div>
      }

      {/* Bebida gratis */}
      {p.type==="bebida_gratis"&&p.extraProduct&&(
        <div style={{background:"#D4EDDA",borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,color:"#155724",fontWeight:800,letterSpacing:.5,marginBottom:3}}>BEBIDA GRATIS 🎁</div>
            <div style={{fontSize:13,fontWeight:700,color:"#155724"}}>{p.extraProduct}</div>
          </div>
          {p.extraPrice&&<div style={{fontSize:13,fontWeight:900,color:"#155724",background:"#B8EAD4",borderRadius:10,padding:"4px 10px"}}>val. ${p.extraPrice}</div>}
        </div>
      )}

      {/* Precio resumen */}
      {(total>0||p.scope50==="total"||p.type==="descuento_grupo"||p.type==="descuento_estudiante"||p.type==="cumpleanos")&&(
        <div style={{background:`${coverColor}12`,borderRadius:12,padding:"12px 14px",marginBottom:10}}>
          {p.type==="2x1"&&total>0&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:"#555",fontWeight:600}}>Precio normal (1 orden)</span>
              <span style={{fontSize:15,fontWeight:900,color:"#1A1A2E"}}>${total}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
              <span style={{fontSize:13,color:coverColor,fontWeight:800}}>Con 2×1 pagas</span>
              <span style={{fontSize:18,fontWeight:900,color:coverColor}}>${total} <span style={{fontSize:12,fontWeight:600}}>llevas 2</span></span>
            </div>
          </>}
          {p.type==="50%off"&&p.scope50!=="total"&&total>0&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:"#999",fontWeight:600,textDecoration:"line-through"}}>Precio normal</span>
              <span style={{fontSize:13,color:"#999",textDecoration:"line-through"}}>${total}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
              <span style={{fontSize:13,color:"#0C5460",fontWeight:800}}>Con 50% OFF pagas</span>
              <span style={{fontSize:18,fontWeight:900,color:"#0C5460"}}>${Math.round(total/2)}</span>
            </div>
          </>}
          {p.type==="50%off"&&p.scope50==="total"&&<>
            <div style={{fontSize:11,color:"#0C5460",fontWeight:800,letterSpacing:.5,marginBottom:6}}>50% OFF EN CUENTA TOTAL</div>
            <div style={{fontSize:13,color:"#0C5460",fontWeight:700}}>Consumo mínimo: <strong>${p.minOrder}</strong> {p.applyPer?`· ${p.applyPer}`:""}</div>
            {p.excludes&&<div style={{fontSize:12,color:"#888",marginTop:4}}>⚠️ No incluye: {p.excludes}</div>}
          </>}
          {p.type==="descuento_especial"&&total>0&&p.extraPrice&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:"#999",fontWeight:600,textDecoration:"line-through"}}>Precio normal</span>
              <span style={{fontSize:13,color:"#999",textDecoration:"line-through"}}>${total}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
              <span style={{fontSize:13,color:"#155724",fontWeight:800}}>Con promo pagas</span>
              <span style={{fontSize:18,fontWeight:900,color:"#155724"}}>${p.extraPrice}</span>
            </div>
            {p.extraProduct&&<div style={{fontSize:12,color:"#555",marginTop:6}}>+ incluye: {p.extraProduct}</div>}
          </>}
          {p.type==="bebida_gratis"&&total>0&&(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:"#555",fontWeight:600}}>Precio del combo</span>
              <span style={{fontSize:15,fontWeight:900,color:"#1A1A2E"}}>${total}</span>
            </div>
          )}
          {p.type==="postre_gratis"&&total>0&&p.extraProduct&&<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:"#555",fontWeight:600}}>Precio del platillo</span>
              <span style={{fontSize:15,fontWeight:900,color:"#1A1A2E"}}>${total}</span>
            </div>
            <div style={{fontSize:13,color:"#880E4F",fontWeight:800,marginTop:6}}>🍰 + {p.extraProduct} GRATIS{p.extraPrice?` (val. $${p.extraPrice})`:""}</div>
          </>}
          {p.type==="happy_hour"&&(p.items||[]).filter(it=>it.name).map((it,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{it.name}</span>
              <div style={{textAlign:"right"}}>
                {it.price&&<span style={{fontSize:12,color:"#999",textDecoration:"line-through",marginRight:8}}>${it.price}</span>}
                {it.size&&<span style={{fontSize:14,fontWeight:900,color:"#6A1B9A"}}>${it.size}</span>}
              </div>
            </div>
          ))}
          {p.type==="cumpleanos"&&<>
            <div style={{fontSize:11,color:"#F57F17",fontWeight:800,letterSpacing:.5,marginBottom:6}}>🎂 REGALO DE CUMPLEAÑOS</div>
            <div style={{fontSize:14,fontWeight:700,color:"#F57F17"}}>{p.extraProduct}</div>
            {p.extraPrice&&<div style={{fontSize:12,color:"#888",marginTop:4}}>Valor del regalo: ${p.extraPrice}</div>}
            {p.minOrder&&<div style={{fontSize:12,color:"#888",marginTop:4}}>📌 {p.minOrder}</div>}
          </>}
          {p.type==="descuento_grupo"&&p.minOrder&&p.extraPrice&&<>
            <div style={{fontSize:11,color:"#0D47A1",fontWeight:800,letterSpacing:.5,marginBottom:6}}>👥 DESCUENTO POR GRUPO</div>
            <div style={{fontSize:14,fontWeight:700,color:"#0D47A1"}}>Grupos de {p.minOrder}+ personas: <strong>{p.extraPrice}% OFF</strong></div>
            {p.excludes&&<div style={{fontSize:12,color:"#555",marginTop:4}}>Aplica en: {p.excludes}</div>}
          </>}
          {p.type==="descuento_estudiante"&&p.extraPrice&&<>
            <div style={{fontSize:11,color:"#1B5E20",fontWeight:800,letterSpacing:.5,marginBottom:6}}>🎓 DESCUENTO EDUCATIVO</div>
            <div style={{fontSize:14,fontWeight:700,color:"#1B5E20"}}>{p.applyPer||"Estudiantes y maestros"}: <strong>{p.extraPrice}% OFF</strong></div>
            {p.excludes&&<div style={{fontSize:12,color:"#555",marginTop:4}}>Aplica en: {p.excludes}</div>}
          </>}
        </div>
      )}

      {/* Condición */}
      {p.condition&&<div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
        <span style={{fontSize:14,flexShrink:0}}>📌</span>
        <div style={{fontSize:12,color:"#888",fontWeight:600,lineHeight:1.5}}>{p.condition}</div>
      </div>}

      {/* Días y horario */}
      {p.days&&p.days.length>0&&p.timeFrom&&(
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:14}}>🗓</span>
          <div style={{fontSize:12,color:"#888",fontWeight:600}}>{p.days.join(", ")} · {p.timeFrom} – {p.timeTo}</div>
        </div>
      )}
    </div>
  );
}

function Detail({r,onBack,favs,toggleFav}) {
  const isFav = favs.includes(r.id);
  return (
    <div style={{animation:"slideUp .3s ease"}}>
      <button onClick={onBack} style={bB}>← Volver</button>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${r.coverColor}22,${r.coverColor}55)`,borderRadius:24,padding:"28px 24px",textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:80,marginBottom:12}}>{r.emoji}</div>
        <h2 style={{margin:"0 0 4px",fontSize:26,fontWeight:900,color:"#1A1A2E"}}>{r.name}</h2>
        <p style={{margin:"0 0 8px",color:"#666",fontSize:14}}>⭐ {r.rating} · {r.category}</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:12,flexWrap:"wrap"}}>
          <button onClick={(e)=>toggleFav(r.id,e)} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",border:`1.5px solid ${isFav?"#E53E3E":"#E0E0E0"}`,borderRadius:20,padding:"8px 18px",fontSize:13,fontWeight:800,color:isFav?"#E53E3E":"#999",cursor:"pointer"}}>
            {isFav?"❤️":"🤍"} {isFav?"Guardado":"Guardar"}
          </button>
          {r.phone&&(
            <a href={`tel:${r.phone}`} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",border:`1.5px solid ${r.coverColor}`,borderRadius:20,padding:"8px 18px",fontSize:13,fontWeight:800,color:r.coverColor,textDecoration:"none"}}>
              📞 Llamar
            </a>
          )}
          {r.instagramHandle&&(
            <a href={`https://instagram.com/${r.instagramHandle.replace("@","")}`} target="_blank" rel="noreferrer"
              style={{display:"flex",alignItems:"center",gap:6,background:"#fff",border:"1.5px solid #C13584",borderRadius:20,padding:"8px 18px",fontSize:13,fontWeight:800,color:"#C13584",textDecoration:"none"}}>
              📸 Instagram
            </a>
          )}
        </div>
      </div>

      {/* Promos */}
      {(r.promos||[]).map((p,i)=>(
        <PromoCard key={p._id||i} p={p} coverColor={r.coverColor} emoji={r.emoji}/>
      ))}

      {/* Info */}
      <div style={{background:"#F8F9FA",borderRadius:20,padding:20,display:"flex",flexDirection:"column",gap:14,marginBottom:16}}>
        {[
          {icon:"📍",label:"Dirección",value:r.address},
          {icon:"🕐",label:"Horario",value:r.hours},
          r.phone&&{icon:"📞",label:"Teléfono",value:r.phone},
          r.instagramHandle&&{icon:"📸",label:"Instagram",value:r.instagramHandle},
        ].filter(Boolean).map(it=>(
          <div key={it.label} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <span style={{fontSize:20}}>{it.icon}</span>
            <div>
              <div style={{fontSize:11,color:"#999",fontWeight:700,letterSpacing:.5,marginBottom:2}}>{it.label.toUpperCase()}</div>
              <div style={{fontSize:14,color:"#1A1A2E",fontWeight:600}}>{it.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Cómo llegar */}
      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`} target="_blank" rel="noreferrer"
        style={{display:"block",width:"100%",background:r.coverColor,color:"#fff",border:"none",borderRadius:14,padding:"15px 0",fontSize:15,fontWeight:800,cursor:"pointer",textAlign:"center",textDecoration:"none",boxSizing:"border-box"}}>
        Cómo llegar 📍
      </a>
    </div>
  );
}

// Countdown hasta el próximo slot de 30 min
function SlotCountdown({slot30}) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const update = () => {
      const ms = (30*60*1000) - (Date.now() % (30*60*1000));
      const m = Math.floor(ms/60000);
      const s = Math.floor((ms%60000)/1000);
      setRemaining(`${m}:${s.toString().padStart(2,"0")}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [slot30]);
  return <span style={{fontVariantNumeric:"tabular-nums"}}>{remaining}</span>;
}

function MapView({restaurants, city, activeDay, favs=[], toggleFav=()=>{}}) {
  const mapRef      = useRef(null);
  const leafletMap  = useRef(null);
  const markersRef  = useRef([]);
  const refMarkers  = useRef([]);   // landmarks de referencia
  const [selected, setSelected] = useState(null);
  const [showOverlays, setShowOverlays] = useState(true);
  useEffect(()=>{ const t=setTimeout(()=>setShowOverlays(false),5000); return()=>clearTimeout(t); },[]);

  // ── Carga Leaflet dinámicamente ──────────────────────────────────────────
  useEffect(() => {
    if(!document.getElementById("leaflet-css")) {
      const l = document.createElement("link");
      l.id = "leaflet-css"; l.rel = "stylesheet";
      l.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(l);
    }
    const load = () => { initMap(); };
    if(!window.L) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      s.onload = load;
      document.head.appendChild(s);
    } else { load(); }
    return () => { if(leafletMap.current){ leafletMap.current.remove(); leafletMap.current=null; } };
  }, []);

  useEffect(() => { setSelected(null); if(window.L && mapRef.current) initMap(); }, [city?.id]);
  useEffect(() => { if(window.L && leafletMap.current) addBonMarkers(); }, [restaurants, selected, activeDay]);

  // ── Init mapa con tile limpio (solo calles + nombres, sin negocios OSM) ──
  const initMap = () => {
    if(!mapRef.current || !window.L) return;
    if(leafletMap.current){ leafletMap.current.remove(); leafletMap.current=null; }
    const B = city?.mapBounds||{minLat:25.63,maxLat:25.71,minLng:-100.39,maxLng:-100.27};
    const cLat=(B.minLat+B.maxLat)/2, cLng=(B.minLng+B.maxLng)/2;
    const map = window.L.map(mapRef.current,{zoomControl:false,attributionControl:false})
      .setView([cLat,cLng],15);
    // Tile de CartoDB Positron — calles limpias sin iconos de negocios
    window.L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {maxZoom:19}
    ).addTo(map);
    window.L.control.zoom({position:"bottomright"}).addTo(map);
    leafletMap.current = map;
    addBonMarkers();
  };

  // ── Pins de restaurantes Bonoro ──────────────────────────────────────────
  const addBonMarkers = () => {
    if(!leafletMap.current||!window.L) return;
    markersRef.current.forEach(m=>m.remove()); markersRef.current=[];
    // Ordenar: con promo al frente (zIndex mayor)
    const sorted = [...restaurants].sort((a,b)=>{
      const aHas = (a.promos||[]).some(p=>(p.days||[]).includes(activeDay));
      const bHas = (b.promos||[]).some(p=>(p.days||[]).includes(activeDay));
      return aHas===bHas ? 0 : aHas ? 1 : -1;
    });
    sorted.forEach(r => {
      const hasPromo = (r.promos||[]).some(p=>(p.days||[]).includes(activeDay));
      const isSel = selected?.id===r.id;
      // Dorado Bonoro para con promo, gris para sin promo
      const GOLD = "#D4A017";
      const color = hasPromo ? GOLD : "#BBBBBB";
      const size  = isSel ? 46 : hasPromo ? 40 : 32;
      const opacity = hasPromo ? 1 : 0.55;
      const shadow = hasPromo ? `0 4px 16px ${GOLD}99` : "0 2px 6px rgba(0,0,0,.2)";
      const border = isSel ? "3.5px solid #fff" : hasPromo ? "2.5px solid #fff" : "2px solid #ddd";
      const icon = window.L.divIcon({
        className:"",
        html:`<div style="width:${size}px;height:${size}px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:${shadow};border:${border};opacity:${opacity};">
                <span style="transform:rotate(45deg);font-size:${isSel?22:hasPromo?18:14}px;line-height:1">${r.emoji}</span>
              </div>
              ${hasPromo&&!isSel?`<div style="position:absolute;top:-6px;right:-6px;width:14px;height:14px;background:#FF6B35;border-radius:50%;border:2px solid #fff;font-size:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;">${(r.promos||[]).filter(p=>(p.days||[]).includes(activeDay)).length}</div>`:""}`,
        iconSize:[size,size], iconAnchor:[size/2,size],
      });
      const m = window.L.marker([r.lat,r.lng],{icon,zIndexOffset:hasPromo?200:50})
        .addTo(leafletMap.current)
        .on("click",()=>{ setSelected(r); setShowOverlays(false); leafletMap.current.panTo([r.lat,r.lng],{animate:true}); });
      markersRef.current.push(m);
    });
  };

  // ── Landmarks de referencia al seleccionar un restaurante ────────────────
  useEffect(() => {
    refMarkers.current.forEach(m=>m.remove()); refMarkers.current=[];
    if(!selected||!leafletMap.current||!window.L) return;
    // Consulta Overpass: farmacias, supermercados, bancos en radio 300m
    const query = `[out:json][timeout:10];
      (node["amenity"~"pharmacy|bank|atm"]["name"](around:300,${selected.lat},${selected.lng});
       node["shop"~"supermarket|convenience"]["name"](around:300,${selected.lat},${selected.lng});
       node["amenity"="fuel"]["name"](around:300,${selected.lat},${selected.lng});
      );out 3;`;
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
      .then(r=>r.json())
      .then(data=>{
        const ICONS = {pharmacy:"💊",bank:"🏦",atm:"🏧",supermarket:"🛒",convenience:"🏪",fuel:"⛽"};
        (data.elements||[]).slice(0,3).forEach(el=>{
          const tag = el.tags?.amenity||el.tags?.shop||"";
          const emoji = ICONS[tag]||"📍";
          const name  = el.tags?.name||"Referencia";
          const icon  = window.L.divIcon({
            className:"",
            html:`<div style="background:rgba(255,255,255,.95);border:1.5px solid #E0E0E0;border-radius:20px;padding:4px 8px;font-size:11px;font-weight:700;color:#555;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.12);display:flex;align-items:center;gap:4px;">
                    <span>${emoji}</span><span>${name}</span>
                  </div>`,
            iconAnchor:[0,0],
          });
          const m = window.L.marker([el.lat,el.lon],{icon,zIndexOffset:0,interactive:false})
            .addTo(leafletMap.current);
          refMarkers.current.push(m);
        });
      }).catch(()=>{});
  }, [selected]);

  const p = selected?.promos?.[0];

  return (
    <div style={{position:"relative",height:"calc(100vh - 122px)",margin:"-24px -20px",overflow:"hidden"}}>
      <div ref={mapRef} style={{width:"100%",height:"100%"}}/>

      {/* Conteo + día activo */}
      <div style={{position:"absolute",top:28,right:28,display:"flex",flexDirection:"column",gap:6,zIndex:1000,alignItems:"flex-end"}}>
        <div style={{background:"rgba(26,26,46,.82)",borderRadius:12,padding:"8px 16px",fontSize:11,fontWeight:800,color:"#fff",boxShadow:"0 2px 12px rgba(0,0,0,.2)"}}>
          {restaurants.length} locales
        </div>
        <div style={{background:"rgba(26,26,46,.85)",backdropFilter:"blur(8px)",borderRadius:12,padding:"6px 12px",fontSize:11,fontWeight:800,color:"#fff"}}>
          📅 {activeDay}
        </div>
      </div>

      {/* Leyenda + Hint — desaparecen juntos */}
      <div style={{position:"absolute",bottom:70,left:"50%",transform:"translateX(-50%)",zIndex:1000,whiteSpace:"nowrap",transition:"opacity .4s",opacity:showOverlays?1:0,pointerEvents:showOverlays?"auto":"none"}}>
        <div style={{background:"rgba(26,26,46,.82)",backdropFilter:"blur(10px)",borderRadius:20,padding:"8px 16px",display:"flex",alignItems:"center",gap:7,boxShadow:"0 4px 16px rgba(0,0,0,.2)"}}>
          <span style={{fontSize:13}}>📍</span>
          <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>Los pines dorados tienen promo hoy — en <span style={{color:"#D4A017"}}>Buscar</span> puedes elegir otro día</span>
        </div>
      </div>
      <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:"rgba(26,26,46,.85)",backdropFilter:"blur(10px)",borderRadius:20,padding:"10px 20px",fontSize:12,fontWeight:700,color:"#fff",boxShadow:"0 4px 16px rgba(0,0,0,.25)",zIndex:1000,whiteSpace:"nowrap",transition:"opacity .4s",opacity:showOverlays?1:0,pointerEvents:showOverlays?"auto":"none"}}>
        👆 Toca un restaurante para ver su info
      </div>

      {/* Bottom sheet */}
      {selected&&(
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#fff",borderRadius:"28px 28px 0 0",boxShadow:"0 -8px 40px rgba(0,0,0,.18)",zIndex:1000,animation:"sheetUp .32s ease",paddingBottom:24}}>
          <div style={{display:"flex",justifyContent:"center",paddingTop:12,marginBottom:4}}>
            <div style={{width:40,height:4,borderRadius:2,background:"#E0E0E0"}}/>
          </div>
          <button onClick={()=>setSelected(null)} style={{position:"absolute",top:16,right:16,background:"#F0F0F0",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#666"}}>✕</button>
          <button onClick={(e)=>toggleFav(selected.id,e)} style={{position:"absolute",top:16,right:56,background:"none",border:"none",cursor:"pointer",fontSize:22,padding:"4px",lineHeight:1}}>
            {favs.includes(selected.id)?"❤️":"🤍"}
          </button>
          <div style={{padding:"0 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <div style={{width:56,height:56,borderRadius:16,flexShrink:0,background:`${selected.coverColor}22`,border:`2px solid ${selected.coverColor}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{selected.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:900,fontSize:17,color:"#1A1A2E",marginBottom:2}}>{selected.name}</div>
                <div style={{fontSize:12,color:"#888"}}>⭐ {selected.rating} · {selected.category}</div>
              </div>
            </div>
            {p&&(
              <div style={{background:`${selected.coverColor}12`,border:`2px dashed ${selected.coverColor}`,borderRadius:14,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>{selected.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:13,color:"#1A1A2E",marginBottom:3}}>{p.label}</div>
                  <Badge type={p.type} label={PROMO_TYPES.find(x=>x.id===p.type)?.label||p.type}/>
                </div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {[{icon:"📍",label:"Dirección",val:selected.address},{icon:"🕐",label:"Horario",val:selected.hours}].map(it=>(
                <div key={it.label} style={{display:"flex",gap:10,alignItems:"flex-start",background:"#F8F9FA",borderRadius:12,padding:"9px 12px"}}>
                  <span style={{fontSize:16,marginTop:1}}>{it.icon}</span>
                  <div>
                    <div style={{fontSize:10,color:"#AAA",fontWeight:800,letterSpacing:.5,marginBottom:1}}>{it.label.toUpperCase()}</div>
                    <div style={{fontSize:12,color:"#1A1A2E",fontWeight:600}}>{it.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`,"_blank")}
              style={{width:"100%",background:selected.coverColor,color:"#fff",border:"none",borderRadius:14,padding:"13px 0",fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 20px ${selected.coverColor}55`}}>
              Cómo llegar 🗺️
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes sheetUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0;pointer-events:none}}
        .leaflet-container{font-family:inherit;}
        .leaflet-control-zoom{display:none!important;}
        
      `}</style>
    </div>
  );
}



// ── User Panel ───────────────────────────────────────────────────────────────
// ── Logo reutilizable ─────────────────────────────────────────────────────
function BonLogo({size=40, textSize=22, textColor="#1A1A2E", showText=true}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:size,height:size,flexShrink:0}}>
        <defs>
          <linearGradient id="bGradL" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#B8892A"/>
            <stop offset="100%" stopColor="#F2D45C"/>
          </linearGradient>
          <filter id="gsL">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7A5500" floodOpacity="0.28"/>
          </filter>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#bGradL)" filter="url(#gsL)"/>
        <line x1="9"  y1="5" x2="9"  y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="13" y1="5" x2="13" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="17" y1="5" x2="17" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 10 Q9 13 13 13" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M17 10 Q17 13 13 13" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <line x1="13" y1="13" x2="13" y2="35" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
        <path d="M13 13 L24 13 Q29 13 29 19 Q29 25 13 25" stroke="white" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
        <path d="M13 25 L25 25 Q31 25 31 30 Q31 35 13 35" stroke="white" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
      </svg>
      {showText && <span style={{fontWeight:900,fontSize:textSize,color:textColor,letterSpacing:-.5}}>Bon<span style={{color:"#C9A84C"}}>oro</span></span>}
    </div>
  );
}

function loadUser() { try { const r=localStorage.getItem("bonoro-user"); return Promise.resolve(r?JSON.parse(r):null); } catch { return Promise.resolve(null); } }
function saveUser(u) { try { localStorage.setItem("bonoro-user",JSON.stringify(u)); } catch {} return Promise.resolve(); }
function deleteUser() { try { localStorage.removeItem("bonoro-user"); } catch {} }
function loadFavs() { try { const r=localStorage.getItem("pe-favs"); return r?JSON.parse(r):[]; } catch { return []; } }
function saveFavs(ids) { try { localStorage.setItem("pe-favs",JSON.stringify(ids)); } catch {} }

// Genera código de 6 dígitos simulado
function genCode() { return String(Math.floor(100000+Math.random()*900000)); }

function UserPanel({onClose, currentCityId, onLogin, forceOpen, onOpenDash, onLogout}) {
  const [step, setStep] = useState("loading");
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState(null); // "user" | "restaurant"
  const [verifyMethod, setVerifyMethod] = useState(null); // "sms" | "email"
  const [code, setCode] = useState(""); // código generado
  const [codeInput, setCodeInput] = useState(""); // lo que escribe el usuario
  const [resendTimer, setResendTimer] = useState(0);
  const [f, setF] = useState({
    name:"", lastName:"", lastName2:"",
    dob:"", gender:"", phone:"", email:"", countryCode:"+52", cityId:"",
    residenceCountry:"México", residenceCity:""
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const sf = (k,v) => setF(x=>({...x,[k]:v}));

  useEffect(()=>{
    loadUser().then(u=>{ setUser(u); setStep(u ? "profile" : "welcome"); });
  },[]);

  // Countdown reenvío
  useEffect(()=>{
    if(resendTimer<=0) return;
    const t = setTimeout(()=>setResendTimer(r=>r-1), 1000);
    return ()=>clearTimeout(t);
  },[resendTimer]);

  const sendCode = (method) => {
    const generated = genCode();
    setCode(generated);
    setVerifyMethod(method);
    setResendTimer(30);
    setCodeInput("");
    setErr("");
    // En producción aquí iría el API de SMS/correo
    // Para demo mostramos el código en consola y en UI
    console.log("🔐 Código Bonoro:", generated);
    setStep("verify");
  };

  const confirmCode = async () => {
    if(codeInput !== code) { setErr("Código incorrecto, inténtalo de nuevo"); return; }
    setSaving(true);
    if(step === "verify" && !user) {
      // Registro nuevo
      const newUser = { ...f, id: Date.now(), accountType, createdAt: new Date().toISOString() };
      await saveUser(newUser);
      setUser(newUser);
      setSaving(false);
      setStep("location");
      if(onLogin) onLogin(newUser);
    } else {
      // Login existente
      setSaving(false);
      setStep("location");
      if(onLogin) onLogin(user);
    }
  };

  const requestLocation = (onResult) => {
    if(!navigator.geolocation){ onResult(null); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Busca la ciudad más cercana
        let closest = null, minDist = Infinity;
        CITIES.forEach(c => {
          const cLat = (c.mapBounds.minLat + c.mapBounds.maxLat)/2;
          const cLng = (c.mapBounds.minLng + c.mapBounds.maxLng)/2;
          const dist = Math.sqrt((lat-cLat)**2 + (lng-cLng)**2);
          if(dist < minDist){ minDist=dist; closest=c; }
        });
        onResult(closest);
      },
      () => onResult(null),
      { timeout: 8000 }
    );
  };

  const logout = async () => {
    deleteUser();
    setUser(null); setAccountType(null); setErr("");
    setStep("welcome");
    if(onLogout) onLogout();
  };

  const Err = () => err ? (
    <div style={{background:"#FFF0EB",border:"1.5px solid #FFB899",borderRadius:12,padding:"10px 14px",fontSize:12,color:"#C0392B",fontWeight:700,marginBottom:12}}>
      ⚠️ {err}
    </div>
  ) : null;

  const Label = ({text}) => (
    <div style={{fontSize:11,color:"#999",fontWeight:800,letterSpacing:.6,marginBottom:7}}>{text}</div>
  );

  const W = (children) => forceOpen ? <>{children}</> : (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto",padding:"24px 24px 40px"}}>
        <div style={{width:40,height:4,borderRadius:2,background:"#E0E0E0",margin:"0 auto 20px"}}/>
        {children}
      </div>
    </div>
  );

  // ── LOADING ──────────────────────────────────────────────────────────────
  if(step==="loading") return W(
    <div style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{fontSize:40,animation:"pulse 1s infinite"}}>🏷️</div>
    </div>
  );

  // ── BIENVENIDA ────────────────────────────────────────────────────────────
  if(step==="welcome") return W(
    <div style={{animation:"fadeIn .4s ease"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontWeight:900,fontSize:26,color:"#1A1A2E",marginBottom:6}}>¡Bienvenido! 👋</div>
        <div style={{fontSize:14,color:"#888",lineHeight:1.6}}>Elige cómo quieres unirte a Bonoro</div>
      </div>

      {/* Tipo de cuenta */}
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
        <button onClick={()=>{setAccountType("user");setStep("register");setErr("");}}
          style={{background:"#fff",border:"2px solid #E8E8E8",borderRadius:20,padding:"20px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:16,transition:"all .15s"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,gap:1}}>
                    <div style={{fontSize:26,lineHeight:1}}>👶🏻🧒🏽</div>
                    <div style={{fontSize:26,lineHeight:1}}>👩🏼👴🏼</div>
                  </div>
          <div>
            <div style={{fontWeight:900,fontSize:16,color:"#1A1A2E",marginBottom:3}}>Usuario</div>
            <div style={{fontSize:12,color:"#888",lineHeight:1.4}}>Descubre las mejores promociones de lugares cerca de ti</div>
          </div>
          <span style={{marginLeft:"auto",fontSize:20,color:"#CCC"}}>›</span>
        </button>

        <button onClick={()=>{ if(onOpenDash) onOpenDash(); else alert("Próximamente"); }}
          style={{background:"#FFF8F0",border:"2px solid #FFD9C0",borderRadius:20,padding:"20px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,flexShrink:0}}>🍽️</div>
          <div>
            <div style={{fontWeight:900,fontSize:16,color:"#1A1A2E",marginBottom:3}}>Negocio</div>
            <div style={{fontSize:12,color:"#888",lineHeight:1.4}}>Publica tus promociones y atrae más clientes a tu negocio</div>
          </div>
          <span style={{marginLeft:"auto",fontSize:20,color:"#FF6B35",flexShrink:0}}>›</span>
        </button>
      </div>

      <div style={{textAlign:"center"}}>
        <button onClick={()=>{setErr("");setStep("loginContact");}}
          style={{background:"none",border:"none",cursor:"pointer",color:"#FF6B35",fontWeight:800,fontSize:14,fontFamily:"inherit"}}>
          Ya tengo cuenta → Iniciar sesión
        </button>
      </div>
    </div>
  );

  // ── REGISTRO: DATOS PERSONALES ────────────────────────────────────────────
  if(step==="register") return W(<>
    <button onClick={()=>setStep("welcome")} style={bB}>← Volver</button>
    <div style={{marginBottom:20}}>
      <div style={{fontWeight:900,fontSize:22,color:"#1A1A2E",marginBottom:4}}>Crear cuenta</div>
      <div style={{fontSize:13,color:"#888"}}>Solo toma un momento, sin contraseñas 🎉</div>
    </div>
    <Err/>
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* Nombre */}
      <div>
        <Label text="NOMBRE *"/>
        <input value={f.name} onChange={e=>sf("name",e.target.value)} placeholder="" style={iS}/>
      </div>

      {/* Apellidos */}
      <div>
        <Label text="APELLIDOS *"/>
        <input value={f.lastName} onChange={e=>sf("lastName",e.target.value)} placeholder="" style={iS}/>
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <Label text="FECHA DE NACIMIENTO *"/>
        {/* Máscara DD/MM/AAAA: siempre muestra el template completo */}
        <div style={{position:"relative"}}>
          <input
            value={f.dob}
            onKeyDown={e=>{
              const MASK = "DD/MM/AAAA";
              const digits = f.dob.replace(/\D/g,"");
              if(e.key==="Backspace"){
                e.preventDefault();
                const nd = digits.slice(0,-1);
                let v = "";
                let di = 0;
                for(let i=0;i<MASK.length;i++){
                  if(MASK[i]==="/") { if(di>0||nd.length>0&&i<6) { /* add slash only if there are digits before */ } }
                  if(di < nd.length){ v += nd[di++]; if(MASK[i+1]==="/"&&di<nd.length) v+="/"; }
                  else break;
                }
                // rebuild properly
                let r = nd;
                let out = "";
                if(r.length>=1) out = r.slice(0,2);
                if(r.length>=3) out = r.slice(0,2)+"/"+r.slice(2,4);
                if(r.length>=5) out = r.slice(0,2)+"/"+r.slice(2,4)+"/"+r.slice(4,8);
                if(r.length<=2) out = r;
                sf("dob", out);
                return;
              }
              if(e.key.length===1 && /\d/.test(e.key)){
                e.preventDefault();
                if(digits.length>=8) return;
                const nd = digits + e.key;
                let out = nd.slice(0,2);
                if(nd.length>=3) out = nd.slice(0,2)+"/"+nd.slice(2,4);
                if(nd.length>=5) out = nd.slice(0,2)+"/"+nd.slice(2,4)+"/"+nd.slice(4,8);
                sf("dob", out);
              }
            }}
            onChange={()=>{}}
            readOnly={false}
            inputMode="numeric"
            style={{...iS, caretColor:"#FF6B35", color:"transparent", position:"relative", zIndex:2, background:"transparent"}}
          />
          {/* Overlay visual con máscara */}
          <div style={{
            position:"absolute", inset:0,
            padding:"13px 16px", fontSize:14, fontWeight:600,
            borderRadius:14, pointerEvents:"none", zIndex:1,
            display:"flex", alignItems:"center", letterSpacing:.5
          }}>
            {(()=>{
              const MASK = "DD/MM/AAAA";
              const val  = f.dob;
              let vi = 0;
              return MASK.split("").map((ch, i) => {
                if(ch==="/"){
                  return <span key={i} style={{color:"#999"}}>/</span>;
                }
                if(vi < val.replace(/\//g,"").length){
                  const digit = val.replace(/\//g,"")[vi++];
                  return <span key={i} style={{color:"#1A1A2E"}}>{digit}</span>;
                }
                return <span key={i} style={{color:"#CCCCCC"}}>{ch}</span>;
              });
            })()}
          </div>
        </div>
      </div>

      {/* Género */}
      <div>
        <Label text="GÉNERO"/>
        <div style={{display:"flex",gap:8}}>
          {[
            {v:"Hombre", i:"👨🏻"},
            {v:"Mujer",  i:"👩🏻"},
            {v:"Otro",   i:""},
          ].map(g=>(
            <button key={g.v} onClick={()=>sf("gender",g.v)} style={{
              flex:1,padding:"10px 4px",borderRadius:14,
              border:`2px solid ${f.gender===g.v?"#FF6B35":"#E8E8E8"}`,
              background:f.gender===g.v?"#FFF0EB":"#fff",
              fontSize:12,fontWeight:700,color:f.gender===g.v?"#FF6B35":"#555",cursor:"pointer"
            }}>{g.i && <span style={{fontSize:20,display:"block",marginBottom:2}}>{g.i}</span>}{g.v}</button>
          ))}
        </div>
      </div>

      <div style={{height:1,background:"#F0F0F0",margin:"4px 0"}}/>

      {/* Teléfono */}
      <div>
        <Label text="TELÉFONO *"/>
        <div style={{display:"flex",gap:8}}>
          {/* Selector de lada */}
          <select
            value={f.countryCode||"+52"}
            onChange={e=>sf("countryCode",e.target.value)}
            style={{...iS,width:"auto",flexShrink:0,paddingRight:8,cursor:"pointer",fontWeight:700}}
          >
            {[
              {flag:"🇲🇽",name:"México",code:"+52"},
              {flag:"🇺🇸",name:"EE.UU.",code:"+1"},
              {flag:"🇨🇦",name:"Canadá",code:"+1 CA"},
              {flag:"🇪🇸",name:"España",code:"+34"},
              {flag:"──",name:"──────────",code:"──"},
              {flag:"🇦🇫",name:"Afganistán",code:"+93"},
              {flag:"🇦🇱",name:"Albania",code:"+355"},
              {flag:"🇩🇿",name:"Argelia",code:"+213"},
              {flag:"🇦🇩",name:"Andorra",code:"+376"},
              {flag:"🇦🇴",name:"Angola",code:"+244"},
              {flag:"🇦🇷",name:"Argentina",code:"+54"},
              {flag:"🇦🇲",name:"Armenia",code:"+374"},
              {flag:"🇦🇺",name:"Australia",code:"+61"},
              {flag:"🇦🇹",name:"Austria",code:"+43"},
              {flag:"🇦🇿",name:"Azerbaiyán",code:"+994"},
              {flag:"🇧🇸",name:"Bahamas",code:"+1242"},
              {flag:"🇧🇭",name:"Baréin",code:"+973"},
              {flag:"🇧🇩",name:"Bangladés",code:"+880"},
              {flag:"🇧🇪",name:"Bélgica",code:"+32"},
              {flag:"🇧🇿",name:"Belice",code:"+501"},
              {flag:"🇧🇯",name:"Benín",code:"+229"},
              {flag:"🇧🇴",name:"Bolivia",code:"+591"},
              {flag:"🇧🇦",name:"Bosnia",code:"+387"},
              {flag:"🇧🇷",name:"Brasil",code:"+55"},
              {flag:"🇧🇳",name:"Brunéi",code:"+673"},
              {flag:"🇧🇬",name:"Bulgaria",code:"+359"},
              {flag:"🇧🇫",name:"Burkina Faso",code:"+226"},
              {flag:"🇨🇲",name:"Camerún",code:"+237"},
              {flag:"🇨🇻",name:"Cabo Verde",code:"+238"},
              {flag:"🇨🇱",name:"Chile",code:"+56"},
              {flag:"🇨🇳",name:"China",code:"+86"},
              {flag:"🇨🇴",name:"Colombia",code:"+57"},
              {flag:"🇨🇷",name:"Costa Rica",code:"+506"},
              {flag:"🇨🇺",name:"Cuba",code:"+53"},
              {flag:"🇩🇰",name:"Dinamarca",code:"+45"},
              {flag:"🇩🇴",name:"Rep. Dominicana",code:"+1809"},
              {flag:"🇪🇨",name:"Ecuador",code:"+593"},
              {flag:"🇪🇬",name:"Egipto",code:"+20"},
              {flag:"🇸🇻",name:"El Salvador",code:"+503"},
              {flag:"🇦🇪",name:"Emiratos Árabes",code:"+971"},
              {flag:"🇪🇷",name:"Eritrea",code:"+291"},
              {flag:"🇸🇰",name:"Eslovaquia",code:"+421"},
              {flag:"🇸🇮",name:"Eslovenia",code:"+386"},
              {flag:"🇪🇹",name:"Etiopía",code:"+251"},
              {flag:"🇵🇭",name:"Filipinas",code:"+63"},
              {flag:"🇫🇮",name:"Finlandia",code:"+358"},
              {flag:"🇫🇷",name:"Francia",code:"+33"},
              {flag:"🇬🇦",name:"Gabón",code:"+241"},
              {flag:"🇬🇭",name:"Ghana",code:"+233"},
              {flag:"🇬🇷",name:"Grecia",code:"+30"},
              {flag:"🇬🇹",name:"Guatemala",code:"+502"},
              {flag:"🇬🇳",name:"Guinea",code:"+224"},
              {flag:"🇭🇹",name:"Haití",code:"+509"},
              {flag:"🇭🇳",name:"Honduras",code:"+504"},
              {flag:"🇭🇰",name:"Hong Kong",code:"+852"},
              {flag:"🇭🇺",name:"Hungría",code:"+36"},
              {flag:"🇮🇳",name:"India",code:"+91"},
              {flag:"🇮🇩",name:"Indonesia",code:"+62"},
              {flag:"🇮🇶",name:"Irak",code:"+964"},
              {flag:"🇮🇷",name:"Irán",code:"+98"},
              {flag:"🇮🇪",name:"Irlanda",code:"+353"},
              {flag:"🇮🇱",name:"Israel",code:"+972"},
              {flag:"🇮🇹",name:"Italia",code:"+39"},
              {flag:"🇯🇲",name:"Jamaica",code:"+1876"},
              {flag:"🇯🇵",name:"Japón",code:"+81"},
              {flag:"🇯🇴",name:"Jordania",code:"+962"},
              {flag:"🇰🇿",name:"Kazajistán",code:"+7"},
              {flag:"🇰🇪",name:"Kenia",code:"+254"},
              {flag:"🇰🇼",name:"Kuwait",code:"+965"},
              {flag:"🇱🇧",name:"Líbano",code:"+961"},
              {flag:"🇱🇾",name:"Libia",code:"+218"},
              {flag:"🇲🇾",name:"Malasia",code:"+60"},
              {flag:"🇲🇱",name:"Mali",code:"+223"},
              {flag:"🇲🇦",name:"Marruecos",code:"+212"},
              {flag:"🇳🇮",name:"Nicaragua",code:"+505"},
              {flag:"🇳🇬",name:"Nigeria",code:"+234"},
              {flag:"🇳🇴",name:"Noruega",code:"+47"},
              {flag:"🇳🇿",name:"Nueva Zelanda",code:"+64"},
              {flag:"🇳🇱",name:"Países Bajos",code:"+31"},
              {flag:"🇵🇰",name:"Pakistán",code:"+92"},
              {flag:"🇵🇦",name:"Panamá",code:"+507"},
              {flag:"🇵🇾",name:"Paraguay",code:"+595"},
              {flag:"🇵🇪",name:"Perú",code:"+51"},
              {flag:"🇵🇱",name:"Polonia",code:"+48"},
              {flag:"🇵🇹",name:"Portugal",code:"+351"},
              {flag:"🇵🇷",name:"Puerto Rico",code:"+1787"},
              {flag:"🇬🇧",name:"Reino Unido",code:"+44"},
              {flag:"🇨🇿",name:"Rep. Checa",code:"+420"},
              {flag:"🇷🇴",name:"Rumanía",code:"+40"},
              {flag:"🇷🇺",name:"Rusia",code:"+7"},
              {flag:"🇸🇦",name:"Arabia Saudita",code:"+966"},
              {flag:"🇸🇳",name:"Senegal",code:"+221"},
              {flag:"🇷🇸",name:"Serbia",code:"+381"},
              {flag:"🇸🇬",name:"Singapur",code:"+65"},
              {flag:"🇸🇾",name:"Siria",code:"+963"},
              {flag:"🇸🇴",name:"Somalia",code:"+252"},
              {flag:"🇱🇰",name:"Sri Lanka",code:"+94"},
              {flag:"🇸🇩",name:"Sudán",code:"+249"},
              {flag:"🇸🇪",name:"Suecia",code:"+46"},
              {flag:"🇨🇭",name:"Suiza",code:"+41"},
              {flag:"🇹🇭",name:"Tailandia",code:"+66"},
              {flag:"🇹🇿",name:"Tanzania",code:"+255"},
              {flag:"🇹🇳",name:"Túnez",code:"+216"},
              {flag:"🇹🇷",name:"Turquía",code:"+90"},
              {flag:"🇺🇦",name:"Ucrania",code:"+380"},
              {flag:"🇺🇾",name:"Uruguay",code:"+598"},
              {flag:"🇻🇪",name:"Venezuela",code:"+58"},
              {flag:"🇻🇳",name:"Vietnam",code:"+84"},
              {flag:"🇾🇪",name:"Yemen",code:"+967"},
              {flag:"🇿🇦",name:"Sudáfrica",code:"+27"},
              {flag:"🇿🇲",name:"Zambia",code:"+260"},
              {flag:"🇿🇼",name:"Zimbabue",code:"+263"},
            ].map(c=>(
              c.code==="──"
                ? <option key="sep" disabled>──────────</option>
                : <option key={c.code+c.name} value={c.code}>{c.flag} {c.code} {c.name}</option>
            ))}
          </select>
          <input value={f.phone} onChange={e=>sf("phone",e.target.value)} placeholder="" style={{...iS,flex:1}} type="tel" inputMode="numeric"/>
        </div>
      </div>

      {/* Correo */}
      <div>
        <Label text="CORREO ELECTRÓNICO *"/>
        <input value={f.email} onChange={e=>sf("email",e.target.value)} placeholder="" style={iS} type="email"/>
      </div>

      <button onClick={()=>{
        if(!f.name||!f.lastName||!f.dob||!f.phone||!f.email){setErr("Completa los campos obligatorios");return;}
        setErr(""); setStep("chooseVerify");
      }} style={bP}>Continuar →</button>

      <p style={{fontSize:11,color:"#AAA",textAlign:"center",margin:0,lineHeight:1.6}}>
        Al registrarte aceptas nuestros Términos de Uso y Política de Privacidad.
      </p>
    </div>
  </>);

  // ── ELEGIR MÉTODO DE VERIFICACIÓN ─────────────────────────────────────────
  if(step==="chooseVerify") return W(<>
    <button onClick={()=>setStep("register")} style={bB}>← Volver</button>
    <div style={{textAlign:"center",marginBottom:28}}>
      <div style={{fontSize:40,marginBottom:12}}>🔐</div>
      <div style={{fontWeight:900,fontSize:20,color:"#1A1A2E",marginBottom:6}}>Verificación en 2 pasos</div>
      <div style={{fontSize:13,color:"#888",lineHeight:1.5}}>Te enviaremos un código de 6 dígitos para confirmar tu identidad</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <button onClick={()=>sendCode("sms")} style={{
        background:"#fff",border:"2px solid #E8E8E8",borderRadius:18,padding:"18px 20px",
        cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left"
      }}>
        <div style={{width:44,height:44,borderRadius:12,background:"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📱</div>
        <div>
          <div style={{fontWeight:800,fontSize:14,color:"#1A1A2E"}}>Mensaje SMS</div>
          <div style={{fontSize:12,color:"#888",marginTop:2}}>{f.phone||"Tu teléfono"}</div>
        </div>
        <span style={{marginLeft:"auto",fontSize:18,color:"#CCC"}}>›</span>
      </button>
      <button onClick={()=>sendCode("email")} style={{
        background:"#fff",border:"2px solid #E8E8E8",borderRadius:18,padding:"18px 20px",
        cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left"
      }}>
        <div style={{width:44,height:44,borderRadius:12,background:"#E3F2FD",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📧</div>
        <div>
          <div style={{fontWeight:800,fontSize:14,color:"#1A1A2E"}}>Correo electrónico</div>
          <div style={{fontSize:12,color:"#888",marginTop:2}}>{f.email||"Tu correo"}</div>
        </div>
        <span style={{marginLeft:"auto",fontSize:18,color:"#CCC"}}>›</span>
      </button>
    </div>
  </>);

  // ── INGRESAR CÓDIGO ───────────────────────────────────────────────────────
  if(step==="verify") return W(<>
    <button onClick={()=>setStep(user?"loginContact":"chooseVerify")} style={bB}>← Volver</button>
    <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{fontSize:40,marginBottom:10}}>{verifyMethod==="sms"?"📱":"📧"}</div>
      <div style={{fontWeight:900,fontSize:20,color:"#1A1A2E",marginBottom:6}}>Ingresa el código</div>
      <div style={{fontSize:13,color:"#888",lineHeight:1.5}}>
        Enviamos un código de 6 dígitos a<br/>
        <strong style={{color:"#1A1A2E"}}>{verifyMethod==="sms"?f.phone||user?.phone:f.email||user?.email}</strong>
      </div>
      {/* Demo: muestra el código generado */}
      <div style={{background:"#F0F9FF",borderRadius:12,padding:"8px 16px",marginTop:12,display:"inline-block"}}>
        <span style={{fontSize:11,color:"#0C5460",fontWeight:700}}>Demo — tu código: </span>
        <span style={{fontSize:14,fontWeight:900,color:"#0C5460",letterSpacing:2}}>{code}</span>
      </div>
    </div>
    <Err/>

    {/* Input de 6 dígitos — cada cuadrito es un input */}
    <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
      {[0,1,2,3,4,5].map(i=>(
        <input
          key={i}
          id={`otp-${i}`}
          autoFocus={i===0}
          value={codeInput[i]||""}
          inputMode="numeric"
          maxLength={1}
          onChange={e=>{
            const digit = e.target.value.replace(/\D/g,"").slice(-1);
            const arr = codeInput.split("");
            arr[i] = digit;
            const next = arr.join("").slice(0,6);
            setCodeInput(next); setErr("");
            if(digit && i<5) document.getElementById(`otp-${i+1}`)?.focus();
          }}
          onKeyDown={e=>{
            if(e.key==="Backspace"&&!codeInput[i]&&i>0){
              const arr = codeInput.split("");
              arr[i-1]="";
              setCodeInput(arr.join("")); setErr("");
              document.getElementById(`otp-${i-1}`)?.focus();
            }
          }}
          onFocus={e=>e.target.select()}
          style={{
            width:44,height:54,borderRadius:12,
            border:`2px solid ${codeInput.length===i?"#FF6B35":codeInput[i]?"#C9A84C":"#E8E8E8"}`,
            textAlign:"center",fontSize:22,fontWeight:900,color:"#1A1A2E",
            background:codeInput[i]?"#FFFBF0":"#F8F9FA",
            outline:"none",transition:"border-color .15s",fontFamily:"inherit",cursor:"pointer"
          }}
        />
      ))}
    </div>

    <button onClick={confirmCode} disabled={codeInput.length<6||saving}
      style={{...bP,marginTop:12,opacity:codeInput.length<6?.5:1}}>
      {saving?"Verificando…":"Confirmar código ✓"}
    </button>

    <div style={{textAlign:"center",marginTop:14}}>
      {resendTimer>0
        ? <span style={{fontSize:12,color:"#AAA",fontWeight:700}}>Reenviar en {resendTimer}s</span>
        : <button onClick={()=>sendCode(verifyMethod)} style={{background:"none",border:"none",cursor:"pointer",color:"#FF6B35",fontWeight:800,fontSize:13,fontFamily:"inherit"}}>
            Reenviar código
          </button>
      }
    </div>
  </>);

  // ── LOGIN: CONTACTO ───────────────────────────────────────────────────────
  if(step==="loginContact") return W(<>
    <button onClick={()=>setStep("welcome")} style={bB}>← Volver</button>
    <div style={{marginBottom:20}}>
      <div style={{fontWeight:900,fontSize:22,color:"#1A1A2E",marginBottom:4}}>Iniciar sesión</div>
      <div style={{fontSize:13,color:"#888"}}>Ingresa tu teléfono o correo para recibir tu código</div>
    </div>
    <Err/>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <input value={f.phone} onChange={e=>sf("phone",e.target.value)} placeholder="Teléfono o correo" style={iS}/>
      <button onClick={async()=>{
        const u = await loadUser();
        if(!u){ setErr("No encontramos una cuenta con esos datos"); return; }
        setUser(u);
        setF(x=>({...x,phone:u.phone,email:u.email}));
        setStep("chooseVerifyLogin");
      }} style={bP}>Continuar →</button>
    </div>
  </>);

  // ── LOGIN: ELEGIR MÉTODO ──────────────────────────────────────────────────
  if(step==="chooseVerifyLogin"&&user) return W(<>
    <button onClick={()=>setStep("loginContact")} style={bB}>← Volver</button>
    <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{fontSize:40,marginBottom:10}}>👋</div>
      <div style={{fontWeight:900,fontSize:20,color:"#1A1A2E",marginBottom:4}}>¡Hola, {user.name}!</div>
      <div style={{fontSize:13,color:"#888"}}>¿Cómo quieres recibir tu código?</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {user.phone&&<button onClick={()=>sendCode("sms")} style={{
        background:"#fff",border:"2px solid #E8E8E8",borderRadius:18,padding:"18px 20px",
        cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left"
      }}>
        <div style={{width:44,height:44,borderRadius:12,background:"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📱</div>
        <div><div style={{fontWeight:800,fontSize:14,color:"#1A1A2E"}}>SMS</div><div style={{fontSize:12,color:"#888"}}>{user.phone}</div></div>
        <span style={{marginLeft:"auto",fontSize:18,color:"#CCC"}}>›</span>
      </button>}
      {user.email&&<button onClick={()=>sendCode("email")} style={{
        background:"#fff",border:"2px solid #E8E8E8",borderRadius:18,padding:"18px 20px",
        cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left"
      }}>
        <div style={{width:44,height:44,borderRadius:12,background:"#E3F2FD",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📧</div>
        <div><div style={{fontWeight:800,fontSize:14,color:"#1A1A2E"}}>Correo</div><div style={{fontSize:12,color:"#888"}}>{user.email}</div></div>
        <span style={{marginLeft:"auto",fontSize:18,color:"#CCC"}}>›</span>
      </button>}
    </div>
  </>);

  // ── UBICACIÓN ─────────────────────────────────────────────────────────────
  if(step==="location") return W(
    <div style={{textAlign:"center",padding:"8px 0 8px",animation:"fadeIn .4s ease"}}>
      <div style={{fontSize:56,marginBottom:16}}>📍</div>
      <div style={{fontWeight:900,fontSize:22,color:"#1A1A2E",marginBottom:8}}>¿Dónde estás ahora?</div>
      <div style={{fontSize:13,color:"#888",lineHeight:1.6,marginBottom:28,padding:"0 8px"}}>
        Comparte tu ubicación para ver los restaurantes con promos más cerca de ti — aunque no estés en tu ciudad habitual.
      </div>
      <button onClick={()=>{
        requestLocation(async(city)=>{
          const updated = {...user, cityId: city?.id||user.cityId||"mty", lastLocation: city?.id||null};
          await saveUser(updated);
          setUser(updated);
          setStep("ready");
          if(onLogin) onLogin(updated);
        });
        setStep("locating");
      }} style={bP}>📍 Usar mi ubicación actual</button>
      <button onClick={async()=>{
        setStep("ready");
        if(onLogin) onLogin(user);
      }} style={{...bS,marginTop:12}}>Ahora no, usar mi ciudad registrada</button>
    </div>
  );

  if(step==="locating") return W(
    <div style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{fontSize:48,marginBottom:12,animation:"pulse 1s infinite"}}>📡</div>
      <div style={{fontWeight:800,color:"#1A1A2E",fontSize:16}}>Detectando tu ubicación…</div>
    </div>
  );

  // ── LISTO ─────────────────────────────────────────────────────────────────
  if(step==="ready") return W(
    <div style={{textAlign:"center",padding:"20px 0",animation:"fadeIn .4s ease"}}>
      <div style={{fontSize:64,marginBottom:16}}>🎉</div>
      <div style={{fontWeight:900,fontSize:24,color:"#1A1A2E",marginBottom:8}}>¡Todo listo, {user?.name}!</div>
      <div style={{fontSize:14,color:"#888",lineHeight:1.6,marginBottom:28}}>
        Ya puedes ver las mejores promociones de lugares cerca de ti.
      </div>
      <button onClick={()=>{ if(onLogin) onLogin(user); onClose(); }} style={bP}>Explorar promos 🔥</button>
    </div>
  );

  // ── PERFIL ────────────────────────────────────────────────────────────────
  if(step==="profile"&&user) return W(<>
    <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{
        width:76,height:76,borderRadius:"50%",
        background:"linear-gradient(135deg,#F2D45C,#B8892A)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:34,margin:"0 auto 12px",
        boxShadow:"0 4px 20px rgba(184,137,42,.3)",fontWeight:900,color:"#fff"
      }}>
        {user.name[0].toUpperCase()}
      </div>
      <div style={{fontWeight:900,fontSize:20,color:"#1A1A2E"}}>{user.name} {user.lastName} {user.lastName2}</div>
      <div style={{fontSize:12,color:"#888",marginTop:2}}>{user.email}</div>
    </div>

    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
      {[
        {icon:"🎂",label:"Fecha de nacimiento",val:user.dob?(()=>{const[d,m,y]=user.dob.split("/");return new Date(`${y}-${m}-${d}T12:00`).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})})():"—"},
        {icon:"📱",label:"Teléfono",val:user.phone||"—"},
        {icon:"⚧️",label:"Género",val:user.gender||"—"},
      ].map(it=>(
        <div key={it.label} style={{display:"flex",gap:12,alignItems:"center",background:"#F8F9FA",borderRadius:14,padding:"12px 16px"}}>
          <span style={{fontSize:20}}>{it.icon}</span>
          <div>
            <div style={{fontSize:10,color:"#AAA",fontWeight:800,letterSpacing:.5}}>{it.label.toUpperCase()}</div>
            <div style={{fontSize:13,color:"#1A1A2E",fontWeight:700,marginTop:1}}>{it.val}</div>
          </div>
        </div>
      ))}
    </div>

    {!forceOpen&&<button onClick={onClose} style={bP}>Cerrar</button>}
    <button onClick={logout} style={{...bS,marginTop:10,color:"#E74C3C",borderColor:"#E74C3C"}}>Cerrar sesión</button>
  </>);

  return null;
}

function Dashboard({restaurants,onSave,onClose}) {
  const [step,setStep]=useState("login");
  const [dtab,setDtab]=useState("home");  // home | promos | stats | profile
  const [me,setMe]=useState(null);
  const BLANK_PF={type:"2x1",anyProduct:false,productScope:"",items:[{name:"",size:"",price:""}],price:"",condition:"",days:["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"],timeFrom:"",timeTo:"",extraProduct:"",extraPrice:"",scope50:"product",minOrder:"",excludes:"",applyPer:"Por persona",label:"",_id:null};
  const [pf,setPf]=useState(BLANK_PF);
  const [f,setF]=useState({name:"",category:"Pizza",address:"",hours:"",emoji:"🍕",coverColor:"#FF6B35",email:"",password:""});
  const [editMode,setEditMode]=useState(false);
  const [aiLoad,setAiLoad]=useState(false);
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const sf=(k,v)=>setF(x=>({...x,[k]:v}));
  const spf=(k,v)=>setPf(x=>({...x,[k]:v}));

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login=()=>{
    if(!f.email||!f.password){setErr("Ingresa correo y contraseña");return;}
    const found=restaurants.find(r=>r.email===f.email&&r.password===f.password);
    if(found){setMe(found);setF({...f,...found});setStep("panel");setErr("");}
    else setErr("Credenciales incorrectas");
  };
  const register=async()=>{
    if(!f.name||!f.address||!f.hours||!f.email||!f.password){setErr("Completa todos los campos");return;}
    setSaving(true);
    const nr={id:Date.now(),name:f.name,category:f.category,address:f.address,hours:f.hours,rating:5.0,
      lat:25.66+Math.random()*.04,lng:-100.31-Math.random()*.07,
      promos:[],coverColor:f.coverColor,emoji:f.emoji,email:f.email,password:f.password,
      stats:{views:[12,8,22,15,30,28,40],likes:[2,1,4,3,6,5,9],directions:[1,0,2,1,3,3,5]}};
    const u=[...restaurants,nr];
    await saveDB(u);onSave(u);setMe(nr);setSaving(false);setStep("success");
  };
  const saveInfo=async()=>{
    if(!f.name||!f.address||!f.hours){setErr("Completa nombre, dirección y horario");return;}
    setSaving(true);
    const updated={...me,name:f.name,category:f.category,address:f.address,hours:f.hours,emoji:f.emoji,coverColor:f.coverColor};
    const u=restaurants.map(r=>r.id===me.id?updated:r);
    await saveDB(u);onSave(u);setMe(updated);setSaving(false);setEditMode(false);setErr("");
  };

  // ── Promos ────────────────────────────────────────────────────────────────
  const savePromo=async()=>{
    const hasItems=pf.anyProduct?!!pf.productScope:(pf.items||[]).some(it=>it.name);
    if(!hasItems){setErr(pf.anyProduct?"Especifica a qué aplica la promo":"Agrega al menos un producto");return;}
    if(pf.type==="50%off"&&pf.scope50==="total"&&!pf.minOrder){setErr("Especifica el consumo mínimo");return;}
    if(pf.type==="bebida_gratis"&&!pf.extraProduct){setErr("Especifica qué bebida se regala");return;}
    if(!pf.condition){setErr("Especifica la condición de la promo");return;}
    if(!pf.timeFrom||!pf.timeTo){setErr("Define el horario válido");return;}
    setSaving(true);setErr("");
    let lbl=pf.label;
    if(!lbl){setAiLoad(true);const ai=await aiLabel(me.name,me.category,pf.type,pf.productScope||(pf.items||[])[0]?.name||"");setAiLoad(false);lbl=ai||`${PROMO_TYPES.find(p=>p.id===pf.type)?.label}`;}
    const displayName=pf.anyProduct?pf.productScope:(pf.items||[]).filter(it=>it.name).map(it=>it.name+(it.size?` (${it.size})`:"")).join(" + ");
    const promoData={type:pf.type,label:lbl,product:displayName,anyProduct:pf.anyProduct,productScope:pf.productScope,items:pf.items,scope50:pf.scope50,minOrder:pf.minOrder,excludes:pf.excludes,applyPer:pf.applyPer,price:pf.price,condition:pf.condition,days:pf.days,timeFrom:pf.timeFrom,timeTo:pf.timeTo,extraProduct:pf.extraProduct,extraPrice:pf.extraPrice};
    const updatedPromos=[...(me.promos||[]).filter(p=>p._id!==pf._id),{...promoData,_id:pf._id||Date.now()}];
    const u=restaurants.map(r=>r.id===me.id?{...r,promos:updatedPromos}:r);
    await saveDB(u);onSave(u);setMe(u.find(r=>r.id===me.id));setSaving(false);setDtab("promos");setStep("panel");
  };
  const delPromo=async(promoId)=>{
    const u=restaurants.map(r=>r.id===me.id?{...r,promos:(r.promos||[]).filter(p=>p._id!==promoId)}:r);
    await saveDB(u);onSave(u);setMe(u.find(r=>r.id===me.id));
  };

  // ── Shared UI ─────────────────────────────────────────────────────────────
  const W=(children,noPad=false)=>(
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.55)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:"28px 28px 0 0",width:"100%",maxWidth:430,maxHeight:"94vh",overflowY:"auto",padding:"28px 24px 48px",animation:"slideUp .35s ease"}}>
        <div style={{width:40,height:4,background:"#E0E0E0",borderRadius:2,margin:"0 auto 24px"}}/>
        {children}
      </div>
    </div>
  );
  const Err=()=>err?<div style={{background:"#FDE8E8",color:"#C0392B",borderRadius:12,padding:"10px 14px",fontSize:13,fontWeight:700,marginBottom:16}}>⚠️ {err}</div>:null;
  const PLabel=({text,sub})=><div style={{marginBottom:7}}><div style={{fontSize:11,color:"#999",fontWeight:800,letterSpacing:.6}}>{text}</div>{sub&&<div style={{fontSize:11,color:"#AAA",marginTop:1}}>{sub}</div>}</div>;

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if(step==="login") return W(<>
    <div style={{textAlign:"center",marginBottom:28}}>
      <div style={{width:72,height:72,borderRadius:24,background:"linear-gradient(135deg,#FF6B35,#FF3A6E)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 14px",boxShadow:"0 8px 24px rgba(255,107,53,.35)"}}>🏪</div>
      <h2 style={{fontWeight:900,fontSize:22,color:"#1A1A2E",margin:"0 0 4px"}}>Panel de Negocio</h2>
      <p style={{color:"#888",fontSize:13,margin:0}}>Gestiona tus promos en Bonoro</p>
    </div>
    <Err/>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <input value={f.email} onChange={e=>sf("email",e.target.value)} placeholder="Correo electrónico" style={iS}/>
      <input value={f.password} onChange={e=>sf("password",e.target.value)} type="password" placeholder="Contraseña" style={iS}/>
      <button onClick={login} style={bP}>Iniciar sesión</button>
      <div style={{textAlign:"center",color:"#AAA",fontSize:13}}>¿Aún no tienes cuenta?</div>
      <button onClick={()=>{setStep("register");setErr("");}} style={bS}>Registrar mi negocio 🚀</button>
    </div>
  </>);

  // ── REGISTER ──────────────────────────────────────────────────────────────
  if(step==="register") return W(<>
    <button onClick={()=>setStep("login")} style={bB}>← Volver</button>
    <h2 style={{fontWeight:900,fontSize:20,color:"#1A1A2E",margin:"0 0 4px"}}>Registrar negocio</h2>
    <p style={{color:"#888",fontSize:13,marginBottom:20}}>Empieza a mostrar tus promos gratis</p>
    <Err/>
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <input value={f.name} onChange={e=>sf("name",e.target.value)} placeholder="Nombre del restaurante *" style={iS}/>
      <select value={f.category} onChange={e=>sf("category",e.target.value)} style={iS}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
      <input value={f.address} onChange={e=>sf("address",e.target.value)} placeholder="Dirección completa *" style={iS}/>
      <input value={f.hours} onChange={e=>sf("hours",e.target.value)} placeholder="Horario (ej: 12:00 – 22:00) *" style={iS}/>
      <div>
        <PLabel text="ÍCONO DE TU NEGOCIO"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {EMOJIS.map(e=><button key={e} onClick={()=>sf("emoji",e)} style={{fontSize:22,background:f.emoji===e?"#FFF0EB":"#F8F9FA",border:`2px solid ${f.emoji===e?"#FF6B35":"transparent"}`,borderRadius:12,width:42,height:42,cursor:"pointer"}}>{e}</button>)}
        </div>
      </div>
      <div>
        <PLabel text="COLOR DE MARCA"/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {COLORS.map(c=><button key={c} onClick={()=>sf("coverColor",c)} style={{width:34,height:34,borderRadius:"50%",background:c,border:`3px solid ${f.coverColor===c?"#1A1A2E":"transparent"}`,cursor:"pointer"}}/>)}
        </div>
      </div>
      <input value={f.email} onChange={e=>sf("email",e.target.value)} placeholder="Correo electrónico *" style={iS}/>
      <input value={f.password} onChange={e=>sf("password",e.target.value)} type="password" placeholder="Contraseña *" style={iS}/>
      <button onClick={register} disabled={saving} style={bP}>{saving?"Registrando…":"Crear cuenta 🎉"}</button>
    </div>
  </>);

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if(step==="success") return W(
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:72,marginBottom:16}}>🎉</div>
      <h2 style={{fontWeight:900,fontSize:24,color:"#1A1A2E",margin:"0 0 8px"}}>¡Ya estás en el mapa!</h2>
      <p style={{color:"#666",fontSize:14,marginBottom:28}}>Tu negocio aparece en Bonoro. Agrega tu primera promo.</p>
      <button onClick={()=>{setPf(BLANK_PF);setStep("promos");}} style={bP}>Agregar mi primera promo ✨</button>
      <button onClick={()=>setStep("panel")} style={{...bS,marginTop:12}}>Entrar al panel</button>
    </div>
  );

  // ── ADD/EDIT PROMO ────────────────────────────────────────────────────────
  if(step==="promos"&&me) {
    const DAYS=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
    const toggleDay=d=>setPf(x=>({...x,days:x.days.includes(d)?x.days.filter(dd=>dd!==d):[...x.days,d]}));
    const addItem=()=>setPf(x=>({...x,items:[...(x.items||[]),{name:"",size:"",price:""}]}));
    const updItem=(i,k,v)=>setPf(x=>({...x,items:x.items.map((it,idx)=>idx===i?{...it,[k]:v}:it)}));
    const delItem=i=>setPf(x=>({...x,items:x.items.filter((_,idx)=>idx!==i)}));
    const totalNormal=(pf.items||[]).reduce((s,it)=>s+(Number(it.price)||0),0);
    const ScopeToggle=()=>(
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {[{v:false,icon:"🍽️",label:"Producto específico"},{v:true,icon:"🔓",label:"Cualquier producto"}].map(opt=>(
          <button key={String(opt.v)} onClick={()=>spf("anyProduct",opt.v)} style={{flex:1,padding:"9px 6px",borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer",border:`2px solid ${pf.anyProduct===opt.v?"#FF6B35":"#E8E8E8"}`,background:pf.anyProduct===opt.v?"#FFF0EB":"#F8F9FA",color:pf.anyProduct===opt.v?"#FF6B35":"#555"}}>{opt.icon} {opt.label}</button>
        ))}
      </div>
    );
    const ComboBuilder=({title,sub})=>(
      <div>
        <PLabel text={title} sub={sub}/>
        <ScopeToggle/>
        {pf.anyProduct
          ?<input value={pf.productScope||""} onChange={e=>spf("productScope",e.target.value)} placeholder="Ej: cualquier pizza mediana" style={iS}/>
          :<>
            {(pf.items||[]).map((it,i)=>(
              <div key={i} style={{background:"#F8F9FA",borderRadius:14,padding:"12px 14px",marginBottom:8,position:"relative"}}>
                <button onClick={()=>delItem(i)} style={{position:"absolute",top:8,right:10,background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#CCC"}}>✕</button>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <input value={it.name} onChange={e=>updItem(i,"name",e.target.value)} placeholder={`Producto ${i+1} *`} style={{...iS,fontSize:13}}/>
                  <div style={{display:"flex",gap:8}}>
                    <input value={it.size} onChange={e=>updItem(i,"size",e.target.value)} placeholder="Tamaño / descripción" style={{...iS,fontSize:13,flex:2}}/>
                    <div style={{display:"flex",alignItems:"center",gap:4,flex:1}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#888"}}>$</span>
                      <input value={it.price} onChange={e=>updItem(i,"price",e.target.value.replace(/\D/g,""))} placeholder="Precio" style={{...iS,fontSize:13}} inputMode="numeric"/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addItem} style={{width:"100%",background:"#F8F9FA",border:"2px dashed #E0E0E0",borderRadius:14,padding:"12px",fontSize:13,fontWeight:700,color:"#888",cursor:"pointer"}}>＋ Agregar producto</button>
          </>
        }
      </div>
    );

    return W(<>
      <button onClick={()=>{setStep("panel");setErr("");}} style={bB}>← Volver</button>
      <h2 style={{fontWeight:900,fontSize:20,color:"#1A1A2E",margin:"0 0 4px"}}>{pf._id?"Editar promo":"Nueva promo"}</h2>
      <p style={{color:"#888",fontSize:13,marginBottom:20}}>Todo debe quedar claro para el cliente</p>
      <Err/>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div>
          <PLabel text="TIPO DE PROMOCIÓN *"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {PROMO_TYPES.map(pt=>(
              <button key={pt.id} onClick={()=>spf("type",pt.id)} style={{padding:"10px 8px",borderRadius:12,fontSize:12,fontWeight:800,cursor:"pointer",border:`2px solid ${pf.type===pt.id?"#FF6B35":"#E8E8E8"}`,background:pf.type===pt.id?"#FFF0EB":"#F8F9FA",color:pf.type===pt.id?"#FF6B35":"#555",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:20}}>{pt.icon}</span>{pt.label}
              </button>
            ))}
          </div>
        </div>

        {pf.type==="2x1"&&<>
          <ComboBuilder title="¿QUÉ PRODUCTO ES 2×1? *" sub="El cliente lleva dos del mismo"/>
          <div><PLabel text="CONDICIÓN *"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: Ambas pizzas del mismo tamaño" style={iS}/></div>
        </>}

        {pf.type==="50%off"&&<>
          <div>
            <PLabel text="¿APLICA EN?" sub="Sobre un producto o la cuenta total"/>
            <div style={{display:"flex",gap:8}}>
              {[{v:"product",label:"Producto/combo"},{v:"total",label:"Cuenta total"}].map(opt=>(
                <button key={opt.v} onClick={()=>spf("scope50",opt.v)} style={{flex:1,padding:"9px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",border:`2px solid ${pf.scope50===opt.v?"#17A2B8":"#E8E8E8"}`,background:pf.scope50===opt.v?"#D1ECF1":"#F8F9FA",color:pf.scope50===opt.v?"#0C5460":"#555"}}>{opt.label}</button>
              ))}
            </div>
          </div>
          {pf.scope50==="product"&&<ComboBuilder title="¿QUÉ PRODUCTO CON 50% OFF? *"/>}
          {pf.scope50==="total"&&<>
            <div><PLabel text="CONSUMO MÍNIMO *" sub="Monto mínimo de la cuenta"/><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16,fontWeight:700,color:"#555"}}>$</span><input value={pf.minOrder||""} onChange={e=>spf("minOrder",e.target.value.replace(/\D/g,""))} placeholder="Ej: 300" style={iS} inputMode="numeric"/></div></div>
            <div><PLabel text="¿QUÉ NO INCLUYE? *" sub="Sé claro para evitar malentendidos"/><input value={pf.excludes||""} onChange={e=>spf("excludes",e.target.value)} placeholder="Ej: No incluye bebidas alcohólicas" style={iS}/></div>
            <div>
              <PLabel text="APLICA POR"/>
              <div style={{display:"flex",gap:8}}>
                {["Por persona","Por mesa"].map(opt=>(
                  <button key={opt} onClick={()=>spf("applyPer",opt)} style={{flex:1,padding:"9px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",border:`2px solid ${pf.applyPer===opt?"#17A2B8":"#E8E8E8"}`,background:pf.applyPer===opt?"#D1ECF1":"#F8F9FA",color:pf.applyPer===opt?"#0C5460":"#555"}}>{opt}</button>
                ))}
              </div>
            </div>
          </>}
          <div><PLabel text="CONDICIÓN *"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: Solo en consumo en mesa" style={iS}/></div>
        </>}

        {pf.type==="bebida_gratis"&&<>
          <ComboBuilder title="¿CON QUÉ ORDEN SE REGALA? *" sub="Platillo/combo que activa la promo"/>
          <div><PLabel text="BEBIDA QUE SE REGALA *" sub="Nombre exacto y tamaño"/><input value={pf.extraProduct||""} onChange={e=>spf("extraProduct",e.target.value)} placeholder="Ej: Refresco 400ml cualquier sabor" style={iS}/></div>
          <div><PLabel text="VALOR DE LA BEBIDA" sub="Opcional"/><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16,fontWeight:700,color:"#555"}}>$</span><input value={pf.extraPrice||""} onChange={e=>spf("extraPrice",e.target.value.replace(/\D/g,""))} placeholder="Ej: 45" style={iS} inputMode="numeric"/></div></div>
          <div><PLabel text="CONDICIÓN *"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: Una bebida por persona" style={iS}/></div>
        </>}

        {pf.type==="descuento_especial"&&<>
          <ComboBuilder title="¿QUÉ INCLUYE LA PROMO? *"/>
          <div><PLabel text="PRECIO PROMOCIONAL *"/><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16,fontWeight:700,color:"#555"}}>$</span><input value={pf.extraPrice||""} onChange={e=>spf("extraPrice",e.target.value.replace(/\D/g,""))} placeholder="Ej: 199" style={iS} inputMode="numeric"/></div></div>
          {totalNormal>0&&pf.extraPrice&&<div style={{background:"#D4EDDA",borderRadius:12,padding:"10px 14px",fontSize:13,fontWeight:700,color:"#155724"}}>💰 Normal: <strong>${totalNormal}</strong> → Promo: <strong>${pf.extraPrice}</strong> — Ahorran <strong>${totalNormal-Number(pf.extraPrice)}</strong></div>}
          <div><PLabel text="CONDICIÓN *"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: Solo lunes, no aplica modificaciones" style={iS}/></div>
        </>}

        {pf.type==="postre_gratis"&&<>
          <ComboBuilder title="¿CON QUÉ ORDEN SE REGALA EL POSTRE? *"/>
          <div><PLabel text="POSTRE EXACTO *"/><input value={pf.extraProduct||""} onChange={e=>spf("extraProduct",e.target.value)} placeholder="Ej: Pastel de chocolate individual" style={iS}/></div>
          <div><PLabel text="VALOR DEL POSTRE" sub="Opcional"/><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16,fontWeight:700,color:"#555"}}>$</span><input value={pf.extraPrice||""} onChange={e=>spf("extraPrice",e.target.value.replace(/\D/g,""))} placeholder="Ej: 85" style={iS} inputMode="numeric"/></div></div>
          <div><PLabel text="CONDICIÓN *"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: Un postre por platillo" style={iS}/></div>
        </>}

        {pf.type==="happy_hour"&&<>
          <div><PLabel text="¿QUÉ BEBIDAS INCLUYE? *" sub="Específica o todas"/>
            <ScopeToggle/>
            {pf.anyProduct
              ?<input value={pf.productScope||""} onChange={e=>spf("productScope",e.target.value)} placeholder="Ej: todas las cervezas de barril" style={iS}/>
              :<>
                {(pf.items||[]).map((it,i)=>(
                  <div key={i} style={{background:"#F8F9FA",borderRadius:14,padding:"12px 14px",marginBottom:8,position:"relative"}}>
                    <button onClick={()=>delItem(i)} style={{position:"absolute",top:8,right:10,background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#CCC"}}>✕</button>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <input value={it.name} onChange={e=>updItem(i,"name",e.target.value)} placeholder={`Bebida ${i+1}`} style={{...iS,fontSize:13}}/>
                      <div style={{display:"flex",gap:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:4,flex:1}}><span style={{fontSize:12,color:"#999"}}>Normal $</span><input value={it.price} onChange={e=>updItem(i,"price",e.target.value.replace(/\D/g,""))} style={{...iS,fontSize:13}} inputMode="numeric"/></div>
                        <div style={{display:"flex",alignItems:"center",gap:4,flex:1}}><span style={{fontSize:12,color:"#9C27B0"}}>Promo $</span><input value={it.size} onChange={e=>updItem(i,"size",e.target.value.replace(/\D/g,""))} style={{...iS,fontSize:13}} inputMode="numeric"/></div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addItem} style={{width:"100%",background:"#F8F9FA",border:"2px dashed #E0E0E0",borderRadius:14,padding:"12px",fontSize:13,fontWeight:700,color:"#888",cursor:"pointer"}}>＋ Agregar bebida</button>
              </>
            }
          </div>
          <div><PLabel text="CONDICIÓN *"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: Solo en barra, no para llevar" style={iS}/></div>
        </>}

        {pf.type==="cumpleanos"&&<>
          <div><PLabel text="¿QUÉ SE REGALA? *"/><input value={pf.extraProduct||""} onChange={e=>spf("extraProduct",e.target.value)} placeholder="Ej: Pastel individual con velita" style={iS}/></div>
          <div><PLabel text="VALOR DEL REGALO" sub="Opcional"/><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16,fontWeight:700,color:"#555"}}>$</span><input value={pf.extraPrice||""} onChange={e=>spf("extraPrice",e.target.value.replace(/\D/g,""))} placeholder="Ej: 120" style={iS} inputMode="numeric"/></div></div>
          <div><PLabel text="CONSUMO MÍNIMO" sub="Opcional"/><input value={pf.minOrder||""} onChange={e=>spf("minOrder",e.target.value)} placeholder="Ej: Consumo mínimo $200 por persona" style={iS}/></div>
          <div><PLabel text="VERIFICACIÓN *"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: INE o credencial con fecha de nacimiento" style={iS}/></div>
        </>}

        {pf.type==="descuento_grupo"&&<>
          <div><PLabel text="MÍNIMO DE PERSONAS *"/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["4","5","6","8","10"].map(n=><button key={n} onClick={()=>spf("minOrder",n)} style={{padding:"10px 18px",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",border:`2px solid ${pf.minOrder===n?"#0D47A1":"#E8E8E8"}`,background:pf.minOrder===n?"#E3F2FD":"#F8F9FA",color:pf.minOrder===n?"#0D47A1":"#555"}}>{n}+</button>)}
            </div>
          </div>
          <div><PLabel text="% DE DESCUENTO *"/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["10","15","20","25"].map(n=><button key={n} onClick={()=>spf("extraPrice",n)} style={{padding:"10px 18px",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",border:`2px solid ${pf.extraPrice===n?"#0D47A1":"#E8E8E8"}`,background:pf.extraPrice===n?"#E3F2FD":"#F8F9FA",color:pf.extraPrice===n?"#0D47A1":"#555"}}>{n}%</button>)}
            </div>
          </div>
          <div><PLabel text="APLICA EN"/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Cuenta total","Solo alimentos","Solo bebidas","Alimentos sin alcohol"].map(opt=><button key={opt} onClick={()=>spf("excludes",opt)} style={{padding:"8px 12px",borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer",border:`2px solid ${pf.excludes===opt?"#0D47A1":"#E8E8E8"}`,background:pf.excludes===opt?"#E3F2FD":"#F8F9FA",color:pf.excludes===opt?"#0D47A1":"#555"}}>{opt}</button>)}
            </div>
          </div>
          <div><PLabel text="CONDICIÓN ADICIONAL"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: Reservación previa requerida" style={iS}/></div>
        </>}

        {pf.type==="descuento_estudiante"&&<>
          <div><PLabel text="% DE DESCUENTO *"/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["10","15","20","25"].map(n=><button key={n} onClick={()=>spf("extraPrice",n)} style={{padding:"10px 18px",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",border:`2px solid ${pf.extraPrice===n?"#1B5E20":"#E8E8E8"}`,background:pf.extraPrice===n?"#E8F5E9":"#F8F9FA",color:pf.extraPrice===n?"#1B5E20":"#555"}}>{n}%</button>)}
            </div>
          </div>
          <div><PLabel text="APLICA EN"/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Cuenta total","Solo alimentos","Menú del día","Toda la carta"].map(opt=><button key={opt} onClick={()=>spf("excludes",opt)} style={{padding:"8px 12px",borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer",border:`2px solid ${pf.excludes===opt?"#1B5E20":"#E8E8E8"}`,background:pf.excludes===opt?"#E8F5E9":"#F8F9FA",color:pf.excludes===opt?"#1B5E20":"#555"}}>{opt}</button>)}
            </div>
          </div>
          <div><PLabel text="¿QUIÉN APLICA? *"/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Solo estudiantes","Solo maestros","Ambos"].map(opt=><button key={opt} onClick={()=>spf("applyPer",opt)} style={{padding:"8px 12px",borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer",border:`2px solid ${pf.applyPer===opt?"#1B5E20":"#E8E8E8"}`,background:pf.applyPer===opt?"#E8F5E9":"#F8F9FA",color:pf.applyPer===opt?"#1B5E20":"#555"}}>{opt}</button>)}
            </div>
          </div>
          <div><PLabel text="CREDENCIAL REQUERIDA *"/><input value={pf.condition||""} onChange={e=>spf("condition",e.target.value)} placeholder="Ej: Credencial escolar vigente" style={iS}/></div>
        </>}

        <div style={{height:1,background:"#F0F0F0"}}/>

        <div><PLabel text="DÍAS VÁLIDOS *"/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d=>(
              <button key={d} onClick={()=>toggleDay(d)} style={{padding:"8px 12px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",border:`2px solid ${pf.days.includes(d)?"#FF6B35":"#E8E8E8"}`,background:pf.days.includes(d)?"#FFF0EB":"#F8F9FA",color:pf.days.includes(d)?"#FF6B35":"#555"}}>{d}</button>
            ))}
          </div>
        </div>

        <div><PLabel text="HORARIO VÁLIDO *"/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <input value={pf.timeFrom||""} onChange={e=>spf("timeFrom",e.target.value)} placeholder="09:00" style={{...iS,textAlign:"center"}} maxLength={5}/>
            <span style={{color:"#999",fontWeight:700}}>–</span>
            <input value={pf.timeTo||""} onChange={e=>spf("timeTo",e.target.value)} placeholder="22:00" style={{...iS,textAlign:"center"}} maxLength={5}/>
          </div>
        </div>

        <div><PLabel text="TÍTULO DE LA PROMO" sub="Opcional — la IA lo genera si lo dejas vacío"/>
          <input value={pf.label||""} onChange={e=>spf("label",e.target.value)} placeholder="Ej: 2×1 en pizzas medianas los martes" style={iS}/>
        </div>

        <button onClick={savePromo} disabled={saving||aiLoad} style={bP}>
          {aiLoad?"🤖 Generando con IA…":saving?"Guardando…":"Publicar promo 🚀"}
        </button>
      </div>
    </>);
  }

  // ── MAIN PANEL (tabs) ─────────────────────────────────────────────────────
  if(step==="panel"&&me) {
    const promos=me.promos||[];
    const stats=me.stats||{views:[12,8,22,15,30,28,40],likes:[2,1,4,3,6,5,9],directions:[1,0,2,1,3,3,5]};
    const DAYS_LABEL=["L","M","X","J","V","S","D"];
    const totalViews=stats.views.reduce((a,b)=>a+b,0);
    const totalLikes=stats.likes.reduce((a,b)=>a+b,0);
    const totalDirs=stats.directions.reduce((a,b)=>a+b,0);
    const prevViews=Math.round(totalViews*0.82);
    const prevLikes=Math.round(totalLikes*0.75);
    const prevDirs=Math.round(totalDirs*0.88);
    const pct=(a,b)=>b===0?0:Math.round(((a-b)/b)*100);
    const maxV=Math.max(...stats.views,1);

    const TABS=[{id:"home",icon:"🏠",label:"Inicio"},{id:"promos",icon:"🏷️",label:"Promos"},{id:"stats",icon:"📊",label:"Stats"},{id:"profile",icon:"⚙️",label:"Perfil"}];

    return W(<>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:"1px solid #F0F0F0"}}>
        <div style={{width:48,height:48,borderRadius:14,background:`${me.coverColor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{me.emoji}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:900,fontSize:16,color:"#1A1A2E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{me.name}</div>
          <div style={{fontSize:11,color:"#888",marginTop:1}}>{me.category} · {me.address}</div>
        </div>
        <div style={{background:"#F0FFF4",borderRadius:10,padding:"4px 10px",fontSize:11,fontWeight:800,color:"#27AE60",flexShrink:0}}>● Activo</div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:"#F4F5F9",borderRadius:14,padding:4,marginBottom:20,gap:2}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setDtab(t.id)} style={{flex:1,padding:"8px 4px",borderRadius:10,border:"none",cursor:"pointer",background:dtab===t.id?"#fff":"transparent",boxShadow:dtab===t.id?"0 2px 8px rgba(0,0,0,.08)":"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .15s"}}>
            <span style={{fontSize:16}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:800,color:dtab===t.id?"#1A1A2E":"#AAA"}}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── TAB: HOME ── */}
      {dtab==="home"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {[
            {label:"Vistas",val:totalViews,icon:"👁️",color:"#3498DB",prev:prevViews},
            {label:"Guardados",val:totalLikes,icon:"❤️",color:"#E91E63",prev:prevLikes},
            {label:"Cómo llegar",val:totalDirs,icon:"🗺️",color:"#27AE60",prev:prevDirs},
          ].map(s=>{
            const diff=pct(s.val,s.prev);
            return(
              <div key={s.label} style={{background:"#F8F9FA",borderRadius:16,padding:"14px 10px",textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:4}}>{s.icon}</div>
                <div style={{fontSize:22,fontWeight:900,color:"#1A1A2E"}}>{s.val}</div>
                <div style={{fontSize:10,color:"#AAA",fontWeight:700,marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:10,fontWeight:800,color:diff>=0?"#27AE60":"#E74C3C"}}>{diff>=0?"↑":"↓"}{Math.abs(diff)}% vs sem. ant.</div>
              </div>
            );
          })}
        </div>
        <div style={{background:"#F8F9FA",borderRadius:16,padding:"16px 14px",marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:800,color:"#AAA",letterSpacing:.5,marginBottom:12}}>VISTAS ÚLTIMOS 7 DÍAS</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:60}}>
            {stats.views.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",background:`${me.coverColor}`,borderRadius:"4px 4px 0 0",height:`${Math.round((v/maxV)*52)+8}px`,opacity:.85,transition:"height .3s"}}/>
                <div style={{fontSize:9,color:"#BBB",fontWeight:700}}>{DAYS_LABEL[i]}</div>
              </div>
            ))}
          </div>
        </div>
        {promos.length===0&&(
          <div style={{background:`${me.coverColor}10`,borderRadius:16,padding:16,textAlign:"center",border:`2px dashed ${me.coverColor}40`}}>
            <div style={{fontSize:32,marginBottom:8}}>🏷️</div>
            <div style={{fontWeight:800,fontSize:14,color:"#1A1A2E",marginBottom:4}}>Sin promos activas</div>
            <div style={{fontSize:12,color:"#888",marginBottom:12}}>Agrega tu primera promo y empieza a atraer clientes</div>
            <button onClick={()=>{setPf(BLANK_PF);setStep("promos");}} style={{...bP,padding:"10px 20px",fontSize:13}}>Agregar promo ✨</button>
          </div>
        )}
      </>}

      {/* ── TAB: PROMOS ── */}
      {dtab==="promos"&&<>
        {promos.length>0
          ?<div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {promos.map((promo,idx)=>(
              <div key={promo._id||idx} style={{background:"#F8F9FA",borderRadius:16,padding:"14px 16px",border:`2px dashed ${me.coverColor}`}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:14,color:"#1A1A2E",marginBottom:4}}>{promo.label}</div>
                    <Badge type={promo.type} label={PROMO_TYPES.find(p=>p.id===promo.type)?.label||promo.type}/>
                    <div style={{fontSize:11,color:"#999",marginTop:6}}>🗓 {(promo.days||[]).join(", ")} · {promo.timeFrom}–{promo.timeTo}</div>
                    <div style={{fontSize:11,color:"#999",marginTop:2}}>📌 {promo.condition}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                    <button onClick={()=>{setPf({...promo});setStep("promos");}} style={{background:"#FFF0EB",border:"none",borderRadius:10,padding:"6px 10px",fontSize:12,fontWeight:800,color:"#FF6B35",cursor:"pointer"}}>✏️</button>
                    <button onClick={()=>delPromo(promo._id)} style={{background:"#FDE8E8",border:"none",borderRadius:10,padding:"6px 10px",fontSize:12,fontWeight:800,color:"#E74C3C",cursor:"pointer"}}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          :<div style={{background:"#F8F9FA",borderRadius:16,padding:20,textAlign:"center",color:"#AAA",fontSize:14,marginBottom:16}}>Sin promociones activas</div>
        }
        <button onClick={()=>{setPf(BLANK_PF);setStep("promos");}} style={bP}>➕ Agregar promo</button>
      </>}

      {/* ── TAB: STATS ── */}
      {dtab==="stats"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          {[
            {label:"Vistas esta semana",val:totalViews,prev:prevViews,icon:"👁️",color:"#3498DB"},
            {label:"Guardados",val:totalLikes,prev:prevLikes,icon:"❤️",color:"#E91E63"},
            {label:"Clicks en cómo llegar",val:totalDirs,prev:prevDirs,icon:"🗺️",color:"#27AE60"},
            {label:"Promos activas",val:promos.length,prev:promos.length,icon:"🏷️",color:"#FF6B35"},
          ].map(s=>{
            const diff=pct(s.val,s.prev);
            return(
              <div key={s.label} style={{background:"#F8F9FA",borderRadius:16,padding:"16px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <span style={{fontSize:20}}>{s.icon}</span>
                  {s.label!=="Promos activas"&&<span style={{fontSize:11,fontWeight:800,color:diff>=0?"#27AE60":"#E74C3C",background:diff>=0?"#F0FFF4":"#FDE8E8",borderRadius:8,padding:"2px 7px"}}>{diff>=0?"↑":"↓"}{Math.abs(diff)}%</span>}
                </div>
                <div style={{fontSize:26,fontWeight:900,color:"#1A1A2E",marginBottom:2}}>{s.val}</div>
                <div style={{fontSize:11,color:"#AAA",fontWeight:700}}>{s.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{background:"#F8F9FA",borderRadius:16,padding:"16px 14px",marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:800,color:"#AAA",letterSpacing:.5,marginBottom:12}}>VISTAS ÚLTIMOS 7 DÍAS</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80}}>
            {stats.views.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{fontSize:9,color:"#555",fontWeight:700,marginBottom:2}}>{v}</div>
                <div style={{width:"100%",background:me.coverColor,borderRadius:"4px 4px 0 0",height:`${Math.round((v/maxV)*60)+4}px`,opacity:.85}}/>
                <div style={{fontSize:9,color:"#BBB",fontWeight:700}}>{DAYS_LABEL[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#FFF8E1",borderRadius:14,padding:"12px 14px",fontSize:12,color:"#F57F17",fontWeight:700}}>
          💡 Las estadísticas se actualizan cada 24 horas con datos reales de usuarios de Bonoro
        </div>
      </>}

      {/* ── TAB: PROFILE ── */}
      {dtab==="profile"&&<>
        <Err/>
        {!editMode?<>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {[
              {icon:me.emoji,label:"Nombre",val:me.name},
              {icon:"🍽️",label:"Categoría",val:me.category},
              {icon:"📍",label:"Dirección",val:me.address},
              {icon:"🕐",label:"Horario",val:me.hours},
              {icon:"📧",label:"Correo",val:me.email},
            ].map(it=>(
              <div key={it.label} style={{display:"flex",gap:12,alignItems:"center",background:"#F8F9FA",borderRadius:14,padding:"12px 14px"}}>
                <span style={{fontSize:20}}>{it.icon}</span>
                <div>
                  <div style={{fontSize:10,color:"#AAA",fontWeight:800,letterSpacing:.5}}>{it.label.toUpperCase()}</div>
                  <div style={{fontSize:13,color:"#1A1A2E",fontWeight:700,marginTop:1}}>{it.val}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>setEditMode(true)} style={bP}>✏️ Editar información</button>
          <button onClick={onClose} style={{...bS,marginTop:10,color:"#AAA",borderColor:"#E8E8E8"}}>Cerrar panel</button>
        </>:<>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
            <input value={f.name} onChange={e=>sf("name",e.target.value)} placeholder="Nombre del restaurante *" style={iS}/>
            <select value={f.category} onChange={e=>sf("category",e.target.value)} style={iS}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
            <input value={f.address} onChange={e=>sf("address",e.target.value)} placeholder="Dirección *" style={iS}/>
            <input value={f.hours} onChange={e=>sf("hours",e.target.value)} placeholder="Horario *" style={iS}/>
            <div>
              <PLabel text="ÍCONO"/>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {EMOJIS.map(e=><button key={e} onClick={()=>sf("emoji",e)} style={{fontSize:22,background:f.emoji===e?"#FFF0EB":"#F8F9FA",border:`2px solid ${f.emoji===e?"#FF6B35":"transparent"}`,borderRadius:12,width:42,height:42,cursor:"pointer"}}>{e}</button>)}
              </div>
            </div>
            <div>
              <PLabel text="COLOR DE MARCA"/>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {COLORS.map(c=><button key={c} onClick={()=>sf("coverColor",c)} style={{width:34,height:34,borderRadius:"50%",background:c,border:`3px solid ${f.coverColor===c?"#1A1A2E":"transparent"}`,cursor:"pointer"}}/>)}
              </div>
            </div>
          </div>
          <button onClick={saveInfo} disabled={saving} style={bP}>{saving?"Guardando…":"Guardar cambios ✅"}</button>
          <button onClick={()=>{setEditMode(false);setErr("");setF({...f,...me});}} style={{...bS,marginTop:10}}>Cancelar</button>
        </>}
      </>}
    </>, false);
  }

  return null;
}

export default function App() {
  const [data,setData]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("home");
  const [sel,setSel]=useState(null);
  const [dash,setDash]=useState(false);
  const [showUser,setShowUser]=useState(false);
  const [sessionKey,setSessionKey]=useState(0);
  const [sStep,setSStep]=useState(0);
  const [sQ,setSQ]=useState("");
  const [sCat,setSCat]=useState(null);
  const [sPromo,setSPromo]=useState(null);
  const [sDay,setSDay]=useState(()=>["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"][new Date().getDay()]); // inicia en hoy
  const [fi,setFi]=useState(0);
  const [favs,setFavs]=useState(()=>loadFavs());
  const [cityId,setCityId]=useState("mty");
  const [showCityPicker,setShowCityPicker]=useState(false);
  const [currentUser,setCurrentUser]=useState(null);
  const [authReady,setAuthReady]=useState(false);

  // Carga datos y sesión en paralelo
  useEffect(()=>{
    Promise.all([loadDB(), loadUser()]).then(([db, u])=>{
      setData(db);
      setCurrentUser(u);
      if(u) setCityId(u.cityId||"mty");
      setAuthReady(true);
      setLoading(false);
    });
  },[]);

  const city = CITIES.find(c=>c.id===cityId) || CITIES[0];
  const cityData = data.filter(r=>r.city===cityId);

  // ── Slot de 30 min para el bloque destacado ───────────────────────────────
  const getSlot30 = () => Math.floor(Date.now() / (30 * 60 * 1000));
  const [slot30, setSlot30] = useState(() => Math.floor(Date.now() / (30 * 60 * 1000)));
  useEffect(() => {
    const msLeft = (30 * 60 * 1000) - (Date.now() % (30 * 60 * 1000));
    const t = setTimeout(() => setSlot30(Math.floor(Date.now() / (30 * 60 * 1000))), msLeft);
    return () => clearTimeout(t);
  }, [slot30]);

  // ── Slot tracker: re-render cuando cambia el slot de 30 min ──────────────
  const [slot, setSlot] = useState(getSlotSeed());
  useEffect(() => {
    const msUntilNextSlot = (15 * 60 * 1000) - (Date.now() % (15 * 60 * 1000));
    const timeout = setTimeout(() => setSlot(getSlotSeed()), msUntilNextSlot);
    return () => clearTimeout(timeout);
  }, [slot]);

  // ── Día de hoy en formato "Lun","Mar"… ────────────────────────────────────
  const TODAY = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"][new Date().getDay()];
  const TODAY_FULL = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][new Date().getDay()];

  // ── Bloque de 8 destacados: solo promos de HOY, máx 1 por categoría ──────
  const featuredBlock = React.useMemo(() => {
    if (!cityData.length) return [];
    const rng = seededRandom(slot30 * 997 + 1);
    const pool = [...cityData.filter(r => r.promos.some(p => (p.days||[]).includes(TODAY)))];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const seen = new Set();
    const block = [];
    for (const r of pool) {
      if (!seen.has(r.category)) { seen.add(r.category); block.push(r); }
      if (block.length === 8) break;
    }
    if (block.length < 8) {
      for (const r of pool) {
        if (!block.includes(r)) block.push(r);
        if (block.length === 8) break;
      }
    }
    return block;
  }, [cityData, slot30]);

  // Carrusel: avanza cada 3.5 s, reset al cambiar el bloque o ciudad
  useEffect(() => { setFi(0); }, [slot30, cityId]);
  useEffect(() => {
    if (!featuredBlock.length) return;
    const t = setInterval(() => setFi(i => (i + 1) % featuredBlock.length), 5000);
    return () => clearInterval(t);
  }, [featuredBlock.length]);

  const pick=(r)=>{setSel(r);setTab("detail");};
  const back=()=>{setSel(null);setTab(sStep>0?"search":"home");};
  const toggleFav=(id,e)=>{ e&&e.stopPropagation(); setFavs(prev=>{ const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]; saveFavs(next); return next; }); };
  const feat = featuredBlock[fi] || featuredBlock[0];
  const byS=cityData.filter(r=>r.name.toLowerCase().includes(sQ.toLowerCase()));
  const byDay = cityData.filter(r=>r.promos.some(p=>(p.days||[]).includes(sDay)));
  const byC=sCat?byDay.filter(r=>r.category===sCat):byDay;
  // byP shuffled de forma justa: seed = slot + categoría + tipo de promo
  const byPRaw=sPromo?byC.filter(r=>r.promos.some(p=>p.type===sPromo)):byC;
  const byP = sStep===2 ? fairShuffle(byPRaw, strSeed((sCat||"") + (sPromo||""))) : byPRaw;

  if(loading||!authReady) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#3D2E1E",fontFamily:"Nunito,sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap');@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}`}</style>
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16,animation:"pulse 1.2s infinite"}}>
          <BonLogo size={72} textSize={28} textColor="#fff"/>
        </div>
        <div style={{fontWeight:700,color:"#888",fontSize:13,marginTop:6}}>Cargando…</div>
      </div>
    </div>
  );

  // Sin sesión → onboarding obligatorio, no se puede cerrar
  if(!currentUser) return(
    <div style={{fontFamily:"Nunito,sans-serif",minHeight:"100vh",background:"#3D2E1E",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box}@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}input{font-family:'Nunito',sans-serif!important}`}</style>
      <div style={{padding:"48px 32px 32px",textAlign:"center",animation:"fadeIn .5s ease"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
          <BonLogo size={72} textSize={30} textColor="#fff"/>
        </div>
        <div style={{fontWeight:800,fontSize:14,color:"#E8DDD0",marginTop:6}}>Cada salida, una gran oferta</div>
      </div>
      <div style={{flex:1,background:"#fff",borderRadius:"28px 28px 0 0",padding:"28px 24px 40px",animation:"fadeIn .6s ease .1s both"}}>
        <UserPanel key={sessionKey} onClose={()=>{}} currentCityId="mty" onLogin={(u)=>{setCurrentUser(u);setCityId(u.cityId||"mty");}} onOpenDash={()=>setDash(true)} forceOpen/>
      </div>
      {dash&&<Dashboard restaurants={data} onSave={u=>setData(u)} onClose={()=>setDash(false)}/>}
    </div>
  );

  return (
    <div style={{fontFamily:"Nunito,sans-serif",minHeight:"100vh",background:"#F7F8FC",maxWidth:430,margin:"0 auto",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box}::-webkit-scrollbar{display:none}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes sheetDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        input,select{font-family:'Nunito',sans-serif!important}
      `}</style>

      <div style={{background:"#fff",padding:"14px 20px 0",boxShadow:"0 2px 12px rgba(0,0,0,.06)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
          <BonLogo size={40} textSize={22} textColor="#1A1A2E"/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setShowCityPicker(v=>!v)} style={{
              background:showCityPicker?"#1A1A2E":"#F4F5F9",
              border:"none",borderRadius:20,padding:"7px 14px",
              fontSize:12,fontWeight:800,
              color:showCityPicker?"#fff":"#1A1A2E",
              cursor:"pointer",display:"flex",alignItems:"center",gap:5,
              transition:"all .2s",
              boxShadow:showCityPicker?"0 4px 14px rgba(26,26,46,.25)":"none"
            }}>
              <span>{city.emoji}</span>
              <span>{city.name}</span>
              <span style={{fontSize:9,opacity:.7}}>{showCityPicker?"▲":"▼"}</span>
            </button>
            <button onClick={()=>setShowUser(true)} style={{width:36,height:36,borderRadius:"50%",border:"2px solid #D4A017",background:"#FBF5E0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
              👤
            </button>
          </div>
        </div>

        {/* ── City Picker Dropdown ── */}
        {showCityPicker&&(
          <div style={{
            position:"absolute",top:"72px",right:20,left:20,
            background:"#fff",borderRadius:20,
            boxShadow:"0 12px 40px rgba(0,0,0,.18)",
            zIndex:200,overflow:"hidden",
            animation:"sheetDown .2s ease",
            border:"1px solid #F0F0F0"
          }}>
            <div style={{padding:"14px 18px 10px",borderBottom:"1px solid #F5F5F5"}}>
              <div style={{fontSize:11,fontWeight:800,color:"#AAA",letterSpacing:.8}}>SELECCIONA TU CIUDAD</div>
            </div>
            {CITIES.map(c=>{
              const count = data.filter(r=>r.city===c.id).length;
              const isActive = c.id===cityId;
              return (
                <div key={c.id} onClick={()=>{
                  setCityId(c.id);
                  setShowCityPicker(false);
                  setSStep(0); setSQ(""); setSCat(null); setSPromo(null); setSDay(["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"][new Date().getDay()]);
                  setTab(t=>t==="detail"?"home":t);
                  setSel(null);
                }} style={{
                  display:"flex",alignItems:"center",gap:14,
                  padding:"13px 18px",cursor:"pointer",
                  background:isActive?"#FFF0EB":"#fff",
                  borderLeft:isActive?"4px solid #FF6B35":"4px solid transparent",
                  transition:"background .15s"
                }}>
                  <span style={{fontSize:24}}>{c.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:14,color:"#1A1A2E"}}>{c.name}</div>
                    <div style={{fontSize:11,color:"#AAA",marginTop:1}}>{c.state}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    {count>0
                      ? <span style={{background:"#F0FFF4",color:"#155724",border:"1px solid #B8EAD4",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:800}}>{count} locales</span>
                      : <span style={{background:"#F8F9FA",color:"#AAA",borderRadius:20,padding:"2px 10px",fontSize:10,fontWeight:700}}>Próximamente</span>
                    }
                    {isActive&&<div style={{fontSize:10,color:"#FF6B35",fontWeight:800,marginTop:3}}>✓ activa</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{display:"flex"}}>
          {[{id:"home",icon:"🏠",label:"Inicio"},{id:"search",icon:"🔍",label:"Buscar"},{id:"favs",icon:"❤️",label:"Favoritos"},{id:"map",icon:"🗺️",label:"Mapa"}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSel(null);setShowCityPicker(false);}}
              style={{flex:1,background:"none",border:"none",padding:"10px 0 14px",cursor:"pointer",fontSize:12,fontWeight:tab===t.id?800:600,color:tab===t.id?"#D4A017":"#AAA",borderBottom:tab===t.id?"3px solid #D4A017":"3px solid transparent",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexDirection:"column"}}>
              <span style={{fontSize:18}}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"12px 20px 100px",overflowY:"auto",height:"calc(100vh - 122px)"}}>

        {tab==="detail"&&sel&&<Detail r={sel} onBack={back} favs={favs} toggleFav={toggleFav}/>}

        {tab==="home"&&(
          <div style={{animation:"fadeIn .3s ease"}} onClick={()=>showCityPicker&&setShowCityPicker(false)}>
            {/* Empty state */}
            {cityData.length===0&&(
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:56,marginBottom:12}}>{city.emoji}</div>
                <div style={{fontWeight:900,fontSize:20,color:"#1A1A2E",marginBottom:8}}>Próximamente en {city.name}</div>
                <div style={{fontSize:13,color:"#888",marginBottom:24}}>Aún no hay restaurantes suscritos en esta ciudad. ¡Sé el primero!</div>
                <button onClick={()=>setDash(true)} style={{...bP,width:"auto",padding:"12px 28px"}}>Registrar mi Restaurante</button>
              </div>
            )}
            {/* Favoritos */}
            {favs.length>0&&(()=>{const favRests=cityData.filter(r=>favs.includes(r.id));return favRests.length>0&&(
              <div style={{marginBottom:24}}>
                <div style={{fontWeight:900,fontSize:15,color:"#1A1A2E",marginBottom:10}}>❤️ Mis favoritos</div>
                <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
                  {favRests.map(r=>(
                    <button key={r.id} onClick={()=>pick(r)}
                      style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:`2px solid ${r.coverColor}33`,borderRadius:20,padding:"8px 14px",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                      <span style={{fontSize:20}}>{r.emoji}</span>
                      <span style={{fontWeight:800,fontSize:13,color:"#1A1A2E"}}>{r.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            );})()}
            {feat ? (
            <div style={{marginBottom:28}}>
              <div style={{marginBottom:10}}>
                <h3 style={{fontWeight:900,fontSize:16,color:"#1A1A2E",margin:"0 0 4px"}}>Promociones de hoy · <span style={{color:"#D4A017"}}>{TODAY_FULL}</span></h3>
                <div style={{fontSize:11,color:"#555",fontWeight:700}}>Más opciones cada 30 min · cambia en <span style={{color:"#D4A017",fontWeight:800}}><SlotCountdown slot30={slot30}/></span></div>
              </div>
              <div style={{borderRadius:24,overflow:"hidden",cursor:"default",background:`linear-gradient(135deg,${feat.coverColor}33,${feat.coverColor}77)`,boxShadow:`0 8px 32px ${feat.coverColor}44`,animation:"fadeIn .5s ease"}}>
                <div style={{padding:"28px 24px 18px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                    <div style={{display:"inline-block",background:feat.coverColor,color:"#fff",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:800,letterSpacing:.5}}>📅 HOY</div>
                    <div style={{fontSize:10,color:"#888",fontWeight:700}}>{fi+1} / {featuredBlock.length}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:20}}>
                    <div style={{fontSize:70}}>{feat.emoji}</div>
                    <div>
                      <h3 style={{margin:"0 0 4px",fontSize:21,fontWeight:900,color:"#1A1A2E"}}>{feat.name}</h3>
                      <p style={{margin:"0 0 4px",color:"#1A1A2E",fontSize:13}}>⭐ {feat.rating} · {feat.category}</p>
                      <p style={{margin:"0 0 10px",color:"#1A1A2E",fontSize:11}}>📍 {feat.address}</p>
                      <div style={{background:"#fff",borderRadius:10,padding:"6px 14px",display:"inline-block",fontWeight:800,fontSize:13,color:feat.coverColor}}>{feat.promos[0]?.label||"Ver promo"}</div>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:5,justifyContent:"center",paddingBottom:16,paddingTop:4}}>
                  {featuredBlock.map((_,i)=>(
                    <div key={i} onClick={e=>{e.stopPropagation();setFi(i);}}
                      style={{width:i===fi?20:6,height:6,borderRadius:3,background:i===fi?feat.coverColor:"rgba(0,0,0,0.15)",transition:"all .3s",cursor:"pointer"}}/>
                  ))}
                </div>
              </div>
            </div>
            ):(
            <div style={{background:"#F8F9FA",borderRadius:20,padding:"28px 20px",textAlign:"center",marginBottom:28}}>
              <div style={{fontSize:40,marginBottom:10}}>😴</div>
              <div style={{fontWeight:800,fontSize:15,color:"#1A1A2E",marginBottom:4}}>Sin promos hoy</div>
              <div style={{fontSize:13,color:"#AAA",marginBottom:14}}>Ningún restaurante en {city?.name||"tu ciudad"} tiene promo activa este día</div>
              <button onClick={()=>setTab("search")} style={{...bP,padding:"10px 24px",fontSize:13}}>Buscar otro día 📅</button>
            </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {featuredBlock.map((r,i)=>(
                <div key={r.id} onClick={()=>pick(r)}
                  style={{display:"flex",alignItems:"center",gap:14,background:i===fi?"#FFF8F0":"#fff",borderRadius:18,padding:"14px 16px",cursor:"pointer",border:`1px solid ${i===fi?"#FFD4B8":"#F0F0F0"}`,boxShadow:i===fi?"0 4px 16px rgba(255,107,53,.12)":"0 2px 10px rgba(0,0,0,.05)",transition:"all .3s"}}>
                  <div style={{width:54,height:54,borderRadius:16,flexShrink:0,background:`${r.coverColor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,position:"relative"}}>
                    {r.emoji}
                    {i===fi&&<div style={{position:"absolute",top:-4,right:-4,background:"#FF6B35",borderRadius:"50%",width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>
                    </div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:15,color:"#1A1A2E",marginBottom:2}}>{r.name}</div>
                    <div style={{fontSize:11,color:"#555",marginBottom:6}}>⭐ {r.rating} · {r.category}</div>
                    <Badge type={r.promos[0].type} label={r.promos[0].label}/>
                  </div>
                  <div style={{fontSize:14,color:"#CCC",flexShrink:0,paddingRight:4}}>›</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="search"&&!sel&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:16,padding:"12px 16px",border:"2px solid #F0F0F0",marginBottom:24,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
              <span style={{fontSize:18}}>🔍</span>
              <input value={sQ} onChange={e=>{setSQ(e.target.value);setSStep(0);}} placeholder="Busca un restaurante..." style={{flex:1,border:"none",outline:"none",fontSize:15,fontWeight:600,color:"#1A1A2E",background:"transparent",fontFamily:"inherit"}}/>
              {sQ&&<button onClick={()=>{setSQ("");setSStep(0);}} style={{background:"#EEE",border:"none",borderRadius:"50%",width:22,height:22,cursor:"pointer",fontSize:12}}>✕</button>}
            </div>

            {sQ?(
              <div>
                <p style={{fontSize:12,color:"#888",fontWeight:700,letterSpacing:.5,marginBottom:12}}>{byS.length} RESULTADOS</p>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {byS.map(r=>(
                    <div key={r.id} onClick={()=>pick(r)} style={{display:"flex",alignItems:"center",gap:14,background:"#fff",borderRadius:16,padding:"14px 16px",cursor:"pointer",border:"1px solid #F0F0F0"}}>
                      <div style={{width:50,height:50,borderRadius:14,flexShrink:0,background:`${r.coverColor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{r.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800,fontSize:15,color:"#1A1A2E"}}>{r.name}</div>
                        <div style={{fontSize:11,color:"#999",marginBottom:5}}>⭐ {r.rating} · {r.category}</div>
                        {r.promos[0]&&<Badge type={r.promos[0].type} label={r.promos[0].label}/>}
                      </div>
                      <div style={{fontSize:14,color:"#CCC",flexShrink:0,paddingRight:4}}>›</div>
                    </div>
                  ))}
                </div>
              </div>
            ):(<>
              {sStep===0&&(
                <div>
                  {/* ── Selector de día ── */}
                  <div style={{marginBottom:20}}>
                    <h3 style={{fontWeight:900,fontSize:18,color:"#1A1A2E",marginBottom:6}}>¿Qué día? 📅</h3>
                    <p style={{fontSize:13,color:"#1A1A2E",marginBottom:10}}>Descubre promociones por día</p>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
                      {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d)=>{
                        const isToday = d===TODAY;
                        const active = sDay===d;
                        return(
                          <button key={d} onClick={()=>setSDay(d)} style={{
                            padding:"9px 2px",borderRadius:12,fontSize:11,fontWeight:800,cursor:"pointer",textAlign:"center",
                            border:`2px solid ${active?"#1D9E75":isToday?"#D4A017":"#E8E8E8"}`,
                            background:active?"#E1F5EE":isToday?"#FBF5E0":"#F8F9FA",
                            color:active?"#0F6E56":isToday?"#D4A017":"#555",
                          }}>
                            {isToday?"Hoy":d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* ── Indeciso ── */}
                  <h3 style={{fontWeight:900,fontSize:18,color:"#1A1A2E",marginBottom:6}}>¿Indeciso? 🎲</h3>
                  <p style={{fontSize:13,color:"#1A1A2E",marginBottom:10}}>Ver todas las promociones activas</p>
                  <button onClick={()=>{setSCat(null);setSPromo(null);setSStep(2);}}
                    style={{width:"100%",background:"#F8F9FA",color:"#1A1A2E",border:"2px solid #F0F0F0",borderRadius:18,padding:"16px 20px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                    <div>
                      <div style={{fontWeight:900,fontSize:15,color:"#1A1A2E"}}>Ver todas las promociones {sDay===TODAY?"de hoy":`del ${{"Lun":"Lunes","Mar":"Martes","Mié":"Miércoles","Jue":"Jueves","Vie":"Viernes","Sáb":"Sábado","Dom":"Domingo"}[sDay]||sDay}`}</div>
                      <div style={{fontSize:12,color:"#1A1A2E",marginTop:3}}>{byDay.length} restaurante{byDay.length!==1?"s":""} con promociones activas</div>
                    </div>
                    <div style={{fontSize:20,color:"#CCC"}}>›</div>
                  </button>
                  {/* ── Categorías ── */}
                  <h3 style={{fontWeight:900,fontSize:18,color:"#1A1A2E",marginBottom:6}}>¿Qué se te antoja? 🤤</h3>
                  <p style={{fontSize:13,color:"#1A1A2E",marginBottom:20}}>Filtra por categoría</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {CATS.map((cat,i)=>(
                      <button key={cat} onClick={()=>{setSCat(cat);setSStep(1);}}
                        style={{background:"#fff",border:"2px solid #F0F0F0",borderRadius:18,padding:"18px 16px",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                        <div style={{fontSize:30,marginBottom:6}}>{CICONS[i]||"🍽️"}</div>
                        <div style={{fontWeight:800,fontSize:13,color:"#1A1A2E"}}>{cat}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {sStep===1&&(
                <div style={{animation:"slideUp .3s ease"}}>
                  <button onClick={()=>setSStep(0)} style={bB}>← {sCat}</button>
                  <h3 style={{fontWeight:900,fontSize:18,color:"#1A1A2E",marginBottom:6}}>¿Qué tipo de promo buscas?</h3>
                  <p style={{fontSize:13,color:"#888",marginBottom:20}}>Elige la que más te convenga</p>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    {PROMO_TYPES.map(pt=>(
                      <button key={pt.id} onClick={()=>{setSPromo(pt.id);setSStep(2);}}
                        style={{background:"#fff",border:"2px solid #F0F0F0",borderRadius:18,padding:"18px 20px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:16,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                        <div style={{width:50,height:50,background:"#FFF3F0",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{pt.icon}</div>
                        <div>
                          <div style={{fontWeight:800,fontSize:15,color:"#1A1A2E"}}>{pt.label}</div>
                          <div style={{fontSize:12,color:"#888",marginTop:2}}>{pt.desc}</div>
                        </div>
                        <div style={{marginLeft:"auto",fontSize:20,color:"#ccc"}}>›</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {sStep===2&&(
                <div style={{animation:"slideUp .3s ease"}}>
                  <button onClick={()=>setSStep(sCat?1:0)} style={bB}>← {sCat?`${sCat} · ${PROMO_TYPES.find(p=>p.id===sPromo)?.label}`:"Buscar"}</button>
                  <h3 style={{fontWeight:900,fontSize:18,color:"#1A1A2E",marginBottom:4}}>{sCat?`${sCat} · ${PROMO_TYPES.find(p=>p.id===sPromo)?.label}`:sDay===TODAY?"Todas las promos de hoy":`Todas las promos del ${{"Lun":"Lunes","Mar":"Martes","Mié":"Miércoles","Jue":"Jueves","Vie":"Viernes","Sáb":"Sábado","Dom":"Domingo"}[sDay]||sDay}`}</h3>
                  <p style={{fontSize:12,color:"#888",marginBottom:12,fontWeight:700,letterSpacing:.5}}>{byP.length} RESTAURANTE{byP.length!==1?"S":""} ENCONTRADO{byP.length!==1?"S":""}</p>
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"#F0FFF4",borderRadius:12,padding:"8px 14px",marginBottom:18,border:"1.5px solid #B8EAD4"}}>
                    <span style={{fontSize:14}}>🔀</span>
                    <span style={{fontSize:11,color:"#155724",fontWeight:700}}>
                      Orden aleatorio · se renueva cada 30 min para dar visibilidad equitativa a todos
                    </span>
                  </div>
                  {byP.length===0?(
                    <div style={{textAlign:"center",padding:40}}>
                      <div style={{fontSize:48,marginBottom:12}}>😔</div>
                      <div style={{fontWeight:800,fontSize:16,color:"#1A1A2E",marginBottom:8}}>Sin resultados</div>
                      <div style={{fontSize:13,color:"#888",marginBottom:20}}>No hay restaurantes con esa combinación aún</div>
                      <button onClick={()=>setSStep(0)} style={{...bP,width:"auto",padding:"12px 24px"}}>Intentar de nuevo</button>
                    </div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {byP.map(r=>(
                        <div key={r.id} onClick={()=>pick(r)} style={{background:"#fff",borderRadius:20,overflow:"hidden",cursor:"pointer",border:"1px solid #F0F0F0",boxShadow:"0 4px 16px rgba(0,0,0,.07)",position:"relative"}}>
                          <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#CCC",zIndex:1}}>›</div>
                          <div style={{height:100,background:`linear-gradient(135deg,${r.coverColor}22,${r.coverColor}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:50,position:"relative"}}>
                            {r.emoji}
                            <div style={{position:"absolute",top:10,right:10,background:r.coverColor,color:"#fff",borderRadius:12,padding:"3px 10px",fontSize:10,fontWeight:800}}>{PROMO_TYPES.find(p=>p.id===r.promos[0].type)?.label}</div>
                          </div>
                          <div style={{padding:"14px 16px 16px"}}>
                            <div style={{fontWeight:800,fontSize:15,color:"#1A1A2E",marginBottom:3}}>{r.name}</div>
                            <div style={{fontSize:11,color:"#888",marginBottom:10}}>⭐ {r.rating} · {r.hours}</div>
                            <div style={{fontSize:13,fontWeight:700,color:"#555",marginBottom:8}}>{r.promos[0].label}</div>
                            <div style={{fontSize:12,color:"#999"}}>📍 {r.address}</div>
                          </div>
                        </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>)}
          </div>
        )}

        {tab==="map"&&<div style={{margin:"-24px -20px",height:"calc(100vh - 122px)"}}><MapView restaurants={cityData} city={city} activeDay={sDay||TODAY} favs={favs} toggleFav={toggleFav}/></div>}

        {tab==="favs"&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <h2 style={{fontWeight:900,fontSize:22,color:"#1A1A2E",marginBottom:4}}>Mis favoritos ❤️</h2>
            <p style={{fontSize:13,color:"#888",marginBottom:20}}>{favs.length>0?`${cityData.filter(r=>favs.includes(r.id)).length} restaurante${cityData.filter(r=>favs.includes(r.id)).length!==1?"s":""}  guardado${cityData.filter(r=>favs.includes(r.id)).length!==1?"s":""}  en ${city?.name||"tu ciudad"}`:"Aún no tienes favoritos"}</p>
            {favs.length===0?(
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:56,marginBottom:16}}>🤍</div>
                <div style={{fontWeight:800,fontSize:16,color:"#1A1A2E",marginBottom:8}}>Sin favoritos aún</div>
                <div style={{fontSize:13,color:"#AAA",marginBottom:24}}>Toca el ❤️ en cualquier restaurante para guardarlo aquí</div>
                <button onClick={()=>setTab("home")} style={{...bP,width:"auto",padding:"12px 28px"}}>Explorar restaurantes</button>
              </div>
            ):(()=>{
              const favRests=cityData.filter(r=>favs.includes(r.id));
              const TODAY_DAY=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"][new Date().getDay()];
              const conPromoHoy=favRests.filter(r=>r.promos.some(p=>(p.days||[]).includes(TODAY_DAY)));
              const sinPromoHoy=favRests.filter(r=>!r.promos.some(p=>(p.days||[]).includes(TODAY_DAY)));
              return(<>
                {conPromoHoy.length>0&&(
                  <div style={{marginBottom:24}}>
                    <div style={{fontWeight:900,fontSize:13,color:"#1D9E75",letterSpacing:.5,marginBottom:12}}>🟢 CON PROMO HOY</div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {conPromoHoy.map(r=>(
                        <div key={r.id} onClick={()=>pick(r)} style={{display:"flex",alignItems:"center",gap:14,background:"#fff",borderRadius:18,padding:"14px 16px",cursor:"pointer",border:"2px solid #E1F5EE",boxShadow:"0 2px 10px rgba(0,0,0,.05)",position:"relative"}}>
                          <button onClick={(e)=>toggleFav(r.id,e)} style={{position:"absolute",top:0,right:0,background:"none",border:"none",cursor:"pointer",fontSize:18,padding:"12px",lineHeight:1,borderRadius:"0 18px 0 0"}}>❤️</button>
                          <div style={{width:54,height:54,borderRadius:16,flexShrink:0,background:`${r.coverColor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{r.emoji}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:800,fontSize:15,color:"#1A1A2E",marginBottom:2}}>{r.name}</div>
                            <div style={{fontSize:11,color:"#555",marginBottom:6}}>⭐ {r.rating} · {r.category}</div>
                            <Badge type={r.promos[0].type} label={r.promos[0].label}/>
                          </div>
                          <div style={{fontSize:14,color:"#CCC",flexShrink:0,paddingRight:4}}>›</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sinPromoHoy.length>0&&(
                  <div>
                    <div style={{fontWeight:900,fontSize:13,color:"#AAA",letterSpacing:.5,marginBottom:12}}>⚪ SIN PROMO HOY</div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {sinPromoHoy.map(r=>(
                        <div key={r.id} onClick={()=>pick(r)} style={{display:"flex",alignItems:"center",gap:14,background:"#fff",borderRadius:18,padding:"14px 16px",cursor:"pointer",border:"1px solid #F0F0F0",boxShadow:"0 2px 10px rgba(0,0,0,.05)",opacity:.7,position:"relative"}}>
                          <button onClick={(e)=>toggleFav(r.id,e)} style={{position:"absolute",top:0,right:0,background:"none",border:"none",cursor:"pointer",fontSize:18,padding:"12px",lineHeight:1,borderRadius:"0 18px 0 0"}}>❤️</button>
                          <div style={{width:54,height:54,borderRadius:16,flexShrink:0,background:`${r.coverColor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{r.emoji}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:800,fontSize:15,color:"#1A1A2E",marginBottom:2}}>{r.name}</div>
                            <div style={{fontSize:11,color:"#555"}}>⭐ {r.rating} · {r.category}</div>
                          </div>
                          <div style={{fontSize:14,color:"#CCC",flexShrink:0,paddingRight:4}}>›</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>);
            })()}
          </div>
        )}
      </div>

      {showUser&&<UserPanel onClose={()=>setShowUser(false)} currentCityId={cityId} onOpenDash={()=>{setShowUser(false);setDash(true);}} onLogout={()=>{setCurrentUser(null);setShowUser(false);setSessionKey(k=>k+1);}}/>}
      {dash&&<Dashboard restaurants={data} onSave={u=>setData(u)} onClose={()=>setDash(false)}/>}
    </div>
  );
}
Cambio eliminar apartados de las promociones indivuduales a que aparezcan todas de las que tienen promociones en pizza cuando el usuario le pica a la pizza 