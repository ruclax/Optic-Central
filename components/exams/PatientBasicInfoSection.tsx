import React from "react";

interface PatientBasicInfoSectionProps {
    editable: boolean;
    values?: any;
    onChange?: (field: string, value: any) => void;
}

export const PatientBasicInfoSection: React.FC<PatientBasicInfoSectionProps> = ({ editable, values = {}, onChange }) => (
    <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Información Básica del Paciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" className="input" value={values.nombre || ''} onChange={e => onChange?.("nombre", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <input type="text" className="input" value={values.direccion || ''} onChange={e => onChange?.("direccion", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Ocupación</label>
                <input type="text" className="input" value={values.ocupacion || ''} onChange={e => onChange?.("ocupacion", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Otras actividades</label>
                <input type="text" className="input" value={values.otrasActividades || ''} onChange={e => onChange?.("otrasActividades", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Edad</label>
                <input type="number" className="input" value={values.edad || ''} onChange={e => onChange?.("edad", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input type="text" className="input" value={values.telefono || ''} onChange={e => onChange?.("telefono", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Sexo</label>
                <select className="input" value={values.sexo || ''} onChange={e => onChange?.("sexo", e.target.value)} disabled={!editable}>
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Motivo de consulta</label>
                <input type="text" className="input" value={values.motivacion || ''} onChange={e => onChange?.("motivacion", e.target.value)} disabled={!editable} />
            </div>
        </div>
    </section>
);

export default PatientBasicInfoSection;
