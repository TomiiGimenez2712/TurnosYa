import { DisponibilidadService } from './disponibilidadService.js';
import { ConfigController } from './configController.js';
import { UI } from '../capaDePresentacion/ui.js';

let appState = {
    canchas: [],
    reservasDelDia: [],
    selectedDate: new Date(),
    selectedCourtType: "all",
    bookingState: { courtId: null, courtName: null, time: null, price: 0 },
    clubConfig: null
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if(window.emailjs) emailjs.init({ publicKey: "TU_PUBLIC_KEY_AQUI" });
    } catch(e) { console.log("EmailJS no cargado aún:", e); }

    await cargarConfiguracionClub();

    await cargarCanchas();
    renderDateSelector();
    await loadAndRenderCourts();
});

async function cargarConfiguracionClub() {
    const config = await ConfigController.getConfig();
    if (config) {
        appState.clubConfig = config;
        document.getElementById('club-name-display').textContent = config.nombre;
        document.title = config.nombre + " - Reservas";
    }
}

async function cargarCanchas() {
    appState.canchas = await DisponibilidadService.obtenerCanchas();
    renderFilters();
}

async function loadAndRenderCourts() {
    const dateKey = appState.selectedDate.toISOString().split('T')[0];
    const container = document.getElementById("courts-container");
    container.innerHTML = `<div class="p-10 text-center w-full text-gray-400">Cargando disponibilidad...</div>`;

    appState.reservasDelDia = await DisponibilidadService.obtenerReservasPorFecha(dateKey);
    renderCourts();
}

function renderDateSelector() {
    const container = document.getElementById("date-selector");
    container.innerHTML = "";
    
    for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        
        const isToday = i === 0;
        const btn = document.createElement("button");
        btn.className = `date-btn flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border ${isToday ? 'border-gray-800 active' : 'border-gray-200 bg-white text-gray-600'}`;
        
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        btn.innerHTML = `
            <span class="text-xs font-bold uppercase mb-1">${isToday ? 'Hoy' : days[d.getDay()]}</span>
            <span class="text-xl font-extrabold">${d.getDate()}</span>
        `;
        
        btn.onclick = () => {
            document.querySelectorAll(".date-btn").forEach(b => {
                b.classList.remove("active", "border-gray-800");
                b.classList.add("border-gray-200", "bg-white", "text-gray-600");
            });
            btn.classList.add("active", "border-gray-800");
            btn.classList.remove("border-gray-200", "bg-white", "text-gray-600");
            
            appState.selectedDate = d;
            loadAndRenderCourts();
        };
        container.appendChild(btn);
    }
}

function renderFilters() {
    const container = document.getElementById("court-type-filters");
    if (!container) return; // Por si estamos en otra pagina
    container.innerHTML = "";

    const types = new Set(appState.canchas.map(c => c.tipo_deporte));
    
    const allBtn = document.createElement("button");
    allBtn.className = "filter-btn active border border-transparent px-4 py-1.5 rounded-full text-sm font-bold shadow-sm flex-shrink-0";
    allBtn.textContent = "Todas";
    allBtn.onclick = (e) => setFilter("all", e.target);
    container.appendChild(allBtn);
    
    types.forEach(type => {
        const btn = document.createElement("button");
        btn.className = "filter-btn bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 flex-shrink-0";
        btn.textContent = type;
        btn.onclick = (e) => setFilter(type, e.target);
        container.appendChild(btn);
    });
}

function setFilter(type, btnElement) {
    appState.selectedCourtType = type;
    document.querySelectorAll(".filter-btn").forEach(b => {
        b.className = "filter-btn bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50";
    });
    btnElement.className = "filter-btn active border border-transparent px-4 py-1.5 rounded-full text-sm font-bold shadow-sm";
    renderCourts();
}

function getIconForType(type) {
    const t = type.toLowerCase();
    if (t.includes('fútbol') || t.includes('futbol')) return 'sports_soccer';
    if (t.includes('pádel') || t.includes('padel') || t.includes('tenis')) return 'sports_tennis';
    if (t.includes('basquet') || t.includes('basket')) return 'sports_basketball';
    if (t.includes('voley')) return 'sports_volleyball';
    return 'stadium';
}

function renderCourts() {
    const container = document.getElementById("courts-container");
    if(!container) return;

    container.innerHTML = "";

    const filteredCourts = appState.selectedCourtType === "all" 
        ? appState.canchas 
        : appState.canchas.filter(c => c.tipo_deporte === appState.selectedCourtType);

    filteredCourts.forEach(cancha => {
        const courtBookings = appState.reservasDelDia
            .filter(r => r.cancha_id === cancha.id)
            .map(r => r.hora);
        
        const courtEl = document.createElement("div");
        courtEl.className = "bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 mb-4";
        
        let slotsHtml = '';
        for(let h = cancha.hora_apertura; h < cancha.hora_cierre; h++) {
            const timeStr = `${h}:00`;
            const isBooked = courtBookings.includes(timeStr);
            const slotClass = isBooked ? 'slot-booked' : 'slot-available cursor-pointer';
            
            // Usamos un data attribute en vez de inyectar onclick directo para mayor seguridad y adherencia a modulos
            slotsHtml += `
                <div class="rounded-xl p-3 text-center transition-all ${slotClass} font-bold text-sm" 
                     data-time="${timeStr}" 
                     data-court-id="${cancha.id}" 
                     data-court-name="${cancha.nombre}"
                     data-price="${cancha.precio}"
                     ${isBooked ? '' : 'data-action="book"'}>
                    ${timeStr}
                </div>
            `;
        }

        const iconName = getIconForType(cancha.tipo_deporte);

        courtEl.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <span class="material-symbols-rounded">${iconName}</span>
                </div>
                <div>
                    <h3 class="text-lg font-extrabold">${cancha.nombre}</h3>
                    <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">${cancha.tipo_deporte} - $${cancha.precio}</p>
                </div>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                ${slotsHtml}
            </div>
        `;
        container.appendChild(courtEl);
    });
    
    if(filteredCourts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <span class="material-symbols-rounded text-4xl mb-3 block opacity-50">search_off</span>
                <p>No hay canchas disponibles para este filtro.</p>
            </div>
        `;
    }

    // Attach events to slots
    document.querySelectorAll('[data-action="book"]').forEach(slot => {
        slot.addEventListener('click', (e) => {
            const el = e.currentTarget;
            openBookingModal(
                el.getAttribute('data-court-id'),
                el.getAttribute('data-court-name'),
                el.getAttribute('data-time'),
                el.getAttribute('data-price')
            );
        });
    });
}

function openBookingModal(courtId, courtName, time, price) {
    appState.bookingState = { courtId, courtName, time, price: parseFloat(price) };
    
    const nameInput = document.getElementById("client-name");
    const phoneInput = document.getElementById("client-phone");
    const emailInput = document.getElementById("client-email");
    if(nameInput) nameInput.value = "";
    if(phoneInput) phoneInput.value = "";
    if(emailInput) emailInput.value = "";
    
    document.getElementById("modal-court").textContent = courtName;
    document.getElementById("modal-time").textContent = `${time} hs`;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("modal-date").textContent = appState.selectedDate.toLocaleDateString('es-ES', options);
    
    const modal = document.getElementById("booking-modal");
    const content = document.getElementById("modal-content");
    
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    
    requestAnimationFrame(() => {
        modal.classList.remove("opacity-0");
        content.classList.remove("scale-95");
    });
}

// Para usar desde el HTML, hay que asignar funciones a window temporalmente
// al menos para los botones que ya tienen el onclick() (Cancelar y Confirmar)
window.closeModal = function() {
    const modal = document.getElementById("booking-modal");
    if (!modal) return;
    const content = document.getElementById("modal-content");
    
    modal.classList.add("opacity-0");
    content.classList.add("scale-95");
    
    setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }, 200);
};

window.confirmBooking = async function() {
    const nameInput = document.getElementById("client-name").value.trim();
    const phoneInput = document.getElementById("client-phone").value.trim();
    const emailInput = document.getElementById("client-email").value.trim();

    if(!nameInput || !phoneInput || !emailInput) {
        UI.alert("Por favor completá tu Nombre, WhatsApp y Correo para continuar.", "Datos Incompletos", "error");
        return;
    }
    
    const dateKey = appState.selectedDate.toISOString().split('T')[0];
    
    // Llamar al DisponibilidadService (RNF1 - Concurrencia strict)
    const result = await DisponibilidadService.confirmarReserva({
        cancha_id: appState.bookingState.courtId,
        fecha: dateKey,
        hora: appState.bookingState.time,
        precio: appState.bookingState.price,
        jugador_nombre: nameInput,
        jugador_telefono: phoneInput,
        jugador_email: emailInput
    });

    if (!result.success) {
        UI.alert(result.error, "Error de Reserva", "error");
        return;
    }
    
    window.closeModal();
    loadAndRenderCourts(); 
    showPaymentModal(appState.bookingState.price, nameInput, appState.bookingState.courtName, appState.bookingState.time);
};

function showPaymentModal(price, clientName, courtName, time) {
    const modal = document.getElementById("payment-modal");
    if(!modal) return;
    
    document.getElementById("payment-amount").textContent = `$${price}`;
    
    let bankDetails = "No hay datos bancarios registrados.";
    let phoneWs = "";
    if (appState.clubConfig) {
        bankDetails = appState.clubConfig.detalles_bancarios;
        phoneWs = (appState.clubConfig.telefono_whatsapp || "").replace(/\D/g, '');
    }
    document.getElementById("payment-bank-details").textContent = bankDetails;
    
    const wsBtn = document.getElementById("btn-whatsapp-pay");
    if(phoneWs) {
        const text = encodeURIComponent(`Hola, acabo de reservar *${courtName}* a las *${time} hs* a nombre de *${clientName}*. Adjunto comprobante de transferencia por *$${price}*.`);
        wsBtn.onclick = () => { window.open(`https://wa.me/${phoneWs}?text=${text}`, '_blank'); };
    } else {
        wsBtn.onclick = () => { UI.alert("El club no ha configurado su WhatsApp de recepción.", "No disponible", "info"); };
    }

    const content = document.getElementById("payment-content");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    
    requestAnimationFrame(() => {
        modal.classList.remove("opacity-0");
        content.classList.remove("scale-95");
    });
}

window.copiarAlias = async function() {
    const text = document.getElementById("payment-bank-details").textContent.trim();
    if (!text) return;

    // Intentamos extraer un CBU/CVU (22 dígitos) o un Alias
    const cbuMatch = text.match(/[0-9]{22}/);
    const aliasMatch = text.match(/alias[\s:]*([a-z0-9_\.\-]+)/i);
    
    let textToCopy = "";
    
    if (aliasMatch && aliasMatch[1]) {
        textToCopy = aliasMatch[1]; // Priorizamos alias por ser más amigable
    } else if (cbuMatch && cbuMatch[0]) {
        textToCopy = cbuMatch[0]; // Caemos a CBU
    } else {
        textToCopy = text; // Si no hay formato estándar, copiamos todo como plan b
    }

    try {
        await navigator.clipboard.writeText(textToCopy);
        const btn = document.getElementById("btn-copy-alias");
        btn.innerHTML = '<span class="material-symbols-rounded block text-[18px] text-brand">check</span>';
        setTimeout(() => {
            btn.innerHTML = '<span class="material-symbols-rounded block text-[18px]">content_copy</span>';
        }, 2000);
    } catch(e) {
        console.error("Error al copiar:", e);
    }
}

window.closePaymentModal = function() {
    const modal = document.getElementById("payment-modal");
    if (!modal) return;
    const content = document.getElementById("payment-content");
    
    modal.classList.add("opacity-0");
    content.classList.add("scale-95");
    
    setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }, 200);
};
