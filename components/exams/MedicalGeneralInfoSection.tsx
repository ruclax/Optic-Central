import React from "react";

interface MedicalGeneralInfoSectionProps {
    editable: boolean;
    values?: any;
    onChange?: (field: string, value: any) => void;
}

export const MedicalGeneralInfoSection: React.FC<MedicalGeneralInfoSectionProps> = ({ editable, values = {}, onChange }) => (
    <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Información Médica General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Salud visual (antecedentes visuales)</label>
                <input type="text" className="input" value={values.saludVisual || ''} onChange={e => onChange?.("saludVisual", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Salud general</label>
                <input type="text" className="input" value={values.saludGeneral || ''} onChange={e => onChange?.("saludGeneral", e.target.value)} disabled={!editable} />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Antecedentes familiares</label>
                <input type="text" className="input" value={values.antecedentesFamiliares || ''} onChange={e => onChange?.("antecedentesFamiliares", e.target.value)} disabled={!editable} />
            </div>
        </div>
    </section>
);

export default MedicalGeneralInfoSection;
