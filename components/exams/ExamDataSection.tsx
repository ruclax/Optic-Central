import React from "react";

interface ExamDataSectionProps {
    editable: boolean;
    values?: any;
    onChange?: (field: string, value: any) => void;
}

export const ExamDataSection: React.FC<ExamDataSectionProps> = ({ editable, values = {}, onChange }) => (
    <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Datos del Examen Optométrico</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Equilibrio muscular</label>
                <input type="text" className="input" value={values.equilibrioMuscular || ''} onChange={e => onChange?.("equilibrioMuscular", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Queratometrías (O.D.)</label>
                <input type="text" className="input" value={values.queratometriaOD || ''} onChange={e => onChange?.("queratometriaOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Queratometrías (O.I.)</label>
                <input type="text" className="input" value={values.queratometriaOI || ''} onChange={e => onChange?.("queratometriaOI", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Exploración de anexos</label>
                <input type="text" className="input" value={values.exploracionAnexos || ''} onChange={e => onChange?.("exploracionAnexos", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Oftalmoscopía</label>
                <input type="text" className="input" value={values.oftalmoscopia || ''} onChange={e => onChange?.("oftalmoscopia", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">RX anterior (O.D.)</label>
                <input type="text" className="input" value={values.rxAnteriorOD || ''} onChange={e => onChange?.("rxAnteriorOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">RX anterior (O.I.)</label>
                <input type="text" className="input" value={values.rxAnteriorOI || ''} onChange={e => onChange?.("rxAnteriorOI", e.target.value)} disabled={!editable} />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Diagnóstico (DX)</label>
                <input type="text" className="input" value={values.diagnostico || ''} onChange={e => onChange?.("diagnostico", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">RX final (O.D.)</label>
                <input type="text" className="input" value={values.rxFinalOD || ''} onChange={e => onChange?.("rxFinalOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">RX final (O.I.)</label>
                <input type="text" className="input" value={values.rxFinalOI || ''} onChange={e => onChange?.("rxFinalOI", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Esfera (O.D.)</label>
                <input type="number" className="input" value={values.esferaOD || ''} onChange={e => onChange?.("esferaOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Esfera (O.I.)</label>
                <input type="number" className="input" value={values.esferaOI || ''} onChange={e => onChange?.("esferaOI", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Cilindro (O.D.)</label>
                <input type="number" className="input" value={values.cilindroOD || ''} onChange={e => onChange?.("cilindroOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Cilindro (O.I.)</label>
                <input type="number" className="input" value={values.cilindroOI || ''} onChange={e => onChange?.("cilindroOI", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Eje (O.D.)</label>
                <input type="number" className="input" value={values.ejeOD || ''} onChange={e => onChange?.("ejeOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Eje (O.I.)</label>
                <input type="number" className="input" value={values.ejeOI || ''} onChange={e => onChange?.("ejeOI", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">ADD (O.D.)</label>
                <input type="number" className="input" value={values.addOD || ''} onChange={e => onChange?.("addOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">ADD (O.I.)</label>
                <input type="number" className="input" value={values.addOI || ''} onChange={e => onChange?.("addOI", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Agudeza Visual con Corrección (A.V.C.) O.D.</label>
                <input type="text" className="input" value={values.avcOD || ''} onChange={e => onChange?.("avcOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Agudeza Visual con Corrección (A.V.C.) O.I.</label>
                <input type="text" className="input" value={values.avcOI || ''} onChange={e => onChange?.("avcOI", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Agudeza Visual sin Corrección (A.V.S.) O.D.</label>
                <input type="text" className="input" value={values.avsOD || ''} onChange={e => onChange?.("avsOD", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Agudeza Visual sin Corrección (A.V.S.) O.I.</label>
                <input type="text" className="input" value={values.avsOI || ''} onChange={e => onChange?.("avsOI", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Distancia Interpupilar (D.I.)</label>
                <input type="number" className="input" value={values.distanciaInterpupilar || ''} onChange={e => onChange?.("distanciaInterpupilar", e.target.value)} disabled={!editable} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Distancia Pupilar (D.P.)</label>
                <input type="number" className="input" value={values.distanciaPupilar || ''} onChange={e => onChange?.("distanciaPupilar", e.target.value)} disabled={!editable} />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Recomendaciones</label>
                <textarea className="input" value={values.recomendaciones || ''} onChange={e => onChange?.("recomendaciones", e.target.value)} disabled={!editable} />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Próxima cita</label>
                <input type="date" className="input" value={values.proximaCita || ''} onChange={e => onChange?.("proximaCita", e.target.value)} disabled={!editable} />
            </div>
        </div>
    </section>
);

export default ExamDataSection;
