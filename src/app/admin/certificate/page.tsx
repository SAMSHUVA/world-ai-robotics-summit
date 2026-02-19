"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import {
    LayoutDashboard,
    Files,
    Plus,
    Sparkles,
    History as HistoryIcon,
    LogOut,
    ChevronLeft,
    Undo,
    Eye,
    Trash2,
    Download,
    Upload,
    User,
    CheckCircle,
    AlertTriangle,
    FileBox,
    BadgeAlert,
    Loader2,
    MessageCircle,
    Mail,
    X
} from 'lucide-react';

import './certificate.css';
import { CONFERENCE_CONFIG } from '@/config/conference';

// --- Types ---
type FieldType = {
    id: string;
    type: string;
    label: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    fontFamily: string;
    content?: string; // For images/signatures/logos
};

type Template = {
    id: string;
    name: string;
    image_url: string | null;
    fields: FieldType[];
    created_at?: string;
};

type GenerationHistory = {
    id: string;
    recipient_name: string;
    recipient_email?: string;
    recipient_phone?: string;
    template_name?: string;
    category: string;
    type: 'PDF' | 'ZIP';
    file_url: string;
    created_at: string;
    metadata?: any;
};

export default function CertEngine() {
    const [mounted, setMounted] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');
    const [templates, setTemplates] = useState<Template[]>([]);
    const [history, setHistory] = useState<GenerationHistory[]>([]);

    // Selection / Editor / Generator States
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [editingFields, setEditingFields] = useState<FieldType[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    // Generation State
    const [genMode, setGenMode] = useState<'single' | 'bulk'>('single');
    const [singleFieldValues, setSingleFieldValues] = useState<Record<string, string>>({});
    const [bulkData, setBulkData] = useState<any[]>([]);
    const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
    const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });

    // UI Helpers
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
    const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
    const [currentVerificationId, setCurrentVerificationId] = useState<string>('');

    const supabase = createClient();
    const canvasRef = useRef<HTMLDivElement>(null);
    const hiddenCanvasRef = useRef<HTMLDivElement>(null);

    // --- Initial Data Fetch ---
    useEffect(() => {
        setMounted(true);
        fetchTemplates();
        fetchHistory();
    }, []);

    const handleWhatsAppShare = (h: GenerationHistory) => {
        if (!h.recipient_phone) {
            showToast('No phone number recorded for this certificate', 'error');
            return;
        }
        const message = `Hello ${h.recipient_name}, your certificate for ${h.category} is ready! You can verify and download it here: ${window.location.origin}/verify/${h.id}`;
        const url = `https://wa.me/${h.recipient_phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleEmailShare = async (h: GenerationHistory) => {
        if (!h.recipient_email) {
            showToast('No email address recorded for this certificate', 'error');
            return;
        }

        setSendingEmailId(h.id);
        // showToast('Sending certificate email...', 'success'); // Optional: show "Sending..."

        try {
            const response = await fetch('/api/certificate/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientEmail: h.recipient_email,
                    recipientName: h.recipient_name,
                    certificateLink: `${window.location.origin}/verify/${h.id}`,
                    category: h.category
                })
            });

            if (response.ok) {
                showToast('Email sent from info@iaisr.com', 'success');
            } else {
                const err = await response.json();
                showToast(`Failed to send: ${err.error}`, 'error');
            }
        } catch (err) {
            console.error('Email Dispatch Error:', err);
            showToast('Network error while sending email', 'error');
        } finally {
            setSendingEmailId(null);
        }
    };

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('certificate_templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Fetch templates error:', error);
                showToast(`Failed to load templates: ${error.message}`, 'error');
                return;
            }
            if (data) setTemplates(data);
        } catch (err) {
            console.error('Fetch templates exception:', err);
            showToast('An unexpected error occurred while loading templates', 'error');
        }
    };

    const fetchHistory = async () => {
        const { data } = await supabase
            .from('generated_certificates')
            .select('*, certificate_templates(name)')
            .order('created_at', { ascending: false });

        if (data) {
            const formatted = data.map(item => ({
                id: item.id,
                recipient_name: item.recipient_name,
                recipient_email: item.recipient_email || item.metadata?.recipient_email || item.metadata?.email,
                recipient_phone: item.recipient_phone || item.metadata?.recipient_phone || item.metadata?.phone,
                template_name: item.certificate_templates?.name || 'Unknown',
                category: item.category,
                type: item.file_url?.toLowerCase().includes('.zip') ? 'ZIP' : 'PDF' as any,
                file_url: item.file_url,
                created_at: new Date(item.created_at).toLocaleString(),
                metadata: item.metadata
            }));
            setHistory(formatted);
        }
    };

    // --- Handlers ---
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const navigateTo = (page: string) => {
        setActivePage(page);
        if (page !== 'editor' && page !== 'generate') {
            setSelectedTemplate(null);
            setEditingFields([]);
            setSelectedFieldId(null);
        }
    };

    // --- Hydration Guard ---
    if (!mounted) {
        return (
            <div style={{ height: '100vh', background: 'var(--cert-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="var(--cert-accent)" />
            </div>
        );
    }

    // --- Editor Logic ---
    const handleAddTemplate = async (file: File) => {
        if (!file) return;

        setIsLoading(true);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('certificate-templates')
            .upload(fileName, file);

        if (uploadError) {
            showToast('Error uploading template', 'error');
            setIsLoading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('certificate-templates')
            .getPublicUrl(fileName);

        const newTemplate = {
            name: file.name.split('.')[0] || 'New Template',
            image_url: publicUrl,
            fields: []
        };

        try {
            const { data, error: insertError } = await supabase
                .from('certificate_templates')
                .insert([newTemplate])
                .select();

            if (insertError) {
                console.error('Insert error:', insertError);
                showToast(`Error saving template: ${insertError.message}`, 'error');
                setIsLoading(false);
                return;
            }

            if (data && data.length > 0) {
                showToast('Template uploaded successfully');
                fetchTemplates();
                setSelectedTemplate(data[0]);
                setEditingFields([]);
                setActivePage('editor');
            }
        } catch (err) {
            console.error('Add template exception:', err);
            showToast('An unexpected error occurred while saving the template', 'error');
        }
        setIsLoading(false);
    };

    const suggestFont = (templateName: string, fieldLabel: string): string => {
        const name = templateName.toLowerCase();
        if (fieldLabel === 'Verification QR') return 'Arial';
        if (name.includes('award') || name.includes('appreciation') || name.includes('diploma')) {
            return fieldLabel === 'Recipient Name' ? 'Playfair Display' : 'Lora';
        }
        if (name.includes('modern') || name.includes('tech') || name.includes('startup')) {
            return 'Montserrat';
        }
        return 'Playfair Display'; // Default
    };

    const handleAssetUpload = async (file: File, type: 'signature' | 'logo') => {
        if (!file) return;
        setIsLoading(true);
        const fileName = `${Date.now()}-${type}-${file.name.replace(/\s+/g, '_')}`;

        try {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('certificate-templates') // Reusing same bucket for now, or could create NEW 'assets' bucket
                .upload(fileName, file);

            if (uploadError) {
                showToast(`Error uploading ${type}`, 'error');
                setIsLoading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('certificate-templates')
                .getPublicUrl(fileName);

            const newField: FieldType = {
                id: `${type}-${Date.now()}`,
                type: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
                x: 50,
                y: 50,
                fontSize: type === 'signature' ? 60 : 80,
                fontWeight: '400',
                color: '#ffffff',
                fontFamily: suggestFont(selectedTemplate?.name || '', type),
                content: publicUrl
            };

            setEditingFields([...editingFields, newField]);
            setSelectedFieldId(newField.id);
            showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`);
        } catch (err) {
            console.error(`Asset upload error:`, err);
            showToast('Failed to upload asset', 'error');
        }
        setIsLoading(false);
    };

    const addField = (label: string) => {
        if (editingFields.some(f => f.label === label)) {
            showToast('Field already added', 'error');
            return;
        }
        const newField: FieldType = {
            id: `field-${Date.now()}`,
            type: label.toLowerCase().replace(/\s+/g, '-'),
            label,
            x: 40,
            y: 45,
            fontSize: label === 'Verification QR' ? 80 : 22,
            fontWeight: '700',
            color: label === 'Verification QR' ? '#000000' : '#333333',
            fontFamily: suggestFont(selectedTemplate?.name || '', label)
        };
        setEditingFields([...editingFields, newField]);
        setSelectedFieldId(newField.id);
    };

    const handleDrag = (e: React.MouseEvent, fieldId: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const initialField = editingFields.find(f => f.id === fieldId);
        if (!initialField) return;

        const initialX = (initialField.x / 100) * rect.width;
        const initialY = (initialField.y / 100) * rect.height;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            let newXPercent = ((initialX + dx) / rect.width) * 100;
            let newYPercent = ((initialY + dy) / rect.height) * 100;

            // Ensure within bounds first
            newXPercent = Math.max(0, Math.min(100, newXPercent));
            newYPercent = Math.max(0, Math.min(100, newYPercent));

            // --- Snapping Logic (5% Grid) ---
            newXPercent = Math.round(newXPercent / 5) * 5;
            newYPercent = Math.round(newYPercent / 5) * 5;

            // Center axis snapping (extra stickiness)
            if (Math.abs(newXPercent - 50) < 3) newXPercent = 50;
            if (Math.abs(newYPercent - 50) < 3) newYPercent = 50;

            setEditingFields(prev => prev.map(f =>
                f.id === fieldId ? { ...f, x: newXPercent, y: newYPercent } : f
            ));
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const handleResize = (e: React.MouseEvent, fieldId: string) => {
        e.stopPropagation();
        const startY = e.clientY;
        const initialField = editingFields.find(f => f.id === fieldId);
        if (!initialField) return;
        const initialSize = initialField.fontSize;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const dy = moveEvent.clientY - startY;
            // Every 2px of vertical movement = 1pt font size change
            const newSize = Math.max(8, initialSize + Math.round(dy / 2));
            setEditingFields(prev => prev.map(f =>
                f.id === fieldId ? { ...f, fontSize: newSize } : f
            ));
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const saveTemplateChanges = async () => {
        if (!selectedTemplate) return;
        setIsLoading(true);
        const { error } = await supabase
            .from('certificate_templates')
            .update({ fields: editingFields })
            .eq('id', selectedTemplate.id);

        if (!error) {
            showToast('Template configuration saved successfully', 'success');
            fetchTemplates();
            setTimeout(() => navigateTo('templates'), 1000); // Small delay to show toast
        } else {
            showToast(`Error saving changes: ${error.message}`, 'error');
        }
        setIsLoading(false);
    };

    const generateCertificate = async (
        template: Template,
        fieldValues: Record<string, string>,
        shouldSave = true,
        overrideContactInfo?: { email: string, phone: string }
    ) => {
        const activeContact = overrideContactInfo || contactInfo;
        setIsGenerating(true);
        const verificationId = crypto.randomUUID();
        setCurrentVerificationId(verificationId);

        const captureArea = hiddenCanvasRef.current;
        if (!captureArea) {
            console.error('Capture area (hiddenCanvasRef) not found!');
            showToast('Generation failed: Preview area not ready', 'error');
            setIsGenerating(false);
            return null;
        }

        // 1. Wait for React to update the DOM with the new verificationId
        await new Promise(r => setTimeout(r, 200));

        // 2. Wait for all images in the capture area to be fully loaded
        const images = Array.from(captureArea.querySelectorAll('img'));
        console.log(`Waiting for ${images.length} images to stabilize...`);
        await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = () => { console.log('Image loaded:', img.src); resolve(true); };
                img.onerror = () => { console.error('Image failed to load:', img.src); resolve(false); };
            });
        }));

        // 3. Extra buffer for fonts and layout
        await new Promise(r => setTimeout(r, 300));

        // 4. Wait for fonts to be ready
        try {
            if (typeof document !== 'undefined' && 'fonts' in document) {
                await (document as any).fonts.ready;
            }
        } catch (e) {
            console.warn('Font loading check skipped or failed:', e);
        }

        console.log('Generating certificate with values:', fieldValues);

        try {
            console.log('Starting html2canvas capture at 4x scale...');
            const canvas = await html2canvas(captureArea, {
                scale: 4,
                useCORS: true,
                allowTaint: false,
                backgroundColor: null,
                logging: false,
                windowWidth: 1200,
                windowHeight: 848,
            });

            const imgData = canvas.toDataURL('image/png', 1.0); // Use PNG for lossless quality
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width / 4, canvas.height / 4], // Compensate for 4x scale
                compress: false
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 4, canvas.height / 4, undefined, 'NONE');

            if (shouldSave) {
                const pdfBlob = pdf.output('blob');
                const recipientName = fieldValues[template.fields.find(f => f.label.toLowerCase().includes('name'))?.id || ''] || 'recipient';
                const fileName = `cert_${Date.now()}_${recipientName.replace(/\s+/g, '_')}.pdf`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('generated-certificates')
                    .upload(fileName, pdfBlob, { contentType: 'application/pdf', upsert: true });

                if (uploadData) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('generated-certificates')
                        .getPublicUrl(fileName);

                    // Find category field dynamically
                    const categoryFieldId = template.fields.find(f => f.label.toLowerCase().includes('category'))?.id;
                    const categoryValue = categoryFieldId ? (fieldValues[categoryFieldId] || 'Default') : 'Default';

                    await supabase.from('generated_certificates').insert([{
                        id: verificationId,
                        recipient_name: recipientName,
                        template_id: template.id,
                        category: categoryValue,
                        file_url: publicUrl,
                        metadata: { ...fieldValues, recipient_email: activeContact.email, recipient_phone: activeContact.phone }
                    }]);

                    // Also trigger local download even when saving to storage
                    pdf.save(`${fileName}`);

                    // Reset only if it was a single generation from state
                    if (!overrideContactInfo) setContactInfo({ email: '', phone: '' });
                    fetchHistory();
                    setIsGenerating(false);
                    return publicUrl;
                }
            } else {
                // Just download for local preview/single gen
                const name = fieldValues[template.fields.find(f => f.label.toLowerCase().includes('name'))?.id || ''] || 'certificate';
                console.log(`Downloading PDF as ${name}.pdf`);
                pdf.save(`${name}.pdf`);
                showToast('Certificate downloaded');
            }
            setIsGenerating(false);
        } catch (err) {
            console.error('Generation Error:', err);
            showToast('Error generating certificate', 'error');
            setIsGenerating(false);
            return null;
        }
    };

    const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            setBulkData(data);
            showToast(`Loaded ${data.length} recipients`, 'success');
        };
        reader.readAsBinaryString(file);
    };

    const startBulkGeneration = async () => {
        if (!selectedTemplate || bulkData.length === 0) return;

        setIsGenerating(true);
        setBulkProgress({ current: 0, total: bulkData.length });

        for (let i = 0; i < bulkData.length; i++) {
            const row = bulkData[i] as any;
            const mappedValues: Record<string, string> = {};
            selectedTemplate.fields.forEach(field => {
                const excelKey = Object.keys(row).find(key =>
                    key.toLowerCase().trim() === field.label.toLowerCase().trim()
                );
                if (excelKey) mappedValues[field.id] = String(row[excelKey]);
            });

            setSingleFieldValues(mappedValues);

            // Extract contact info from bulk row if available
            const emailKey = Object.keys(row).find(k => k.toLowerCase().trim() === 'email' || k.toLowerCase().trim() === 'recipient email');
            const phoneKey = Object.keys(row).find(k => k.toLowerCase().trim() === 'phone' || k.toLowerCase().trim() === 'recipient phone' || k.toLowerCase().trim() === 'whatsapp');

            const bulkContact = {
                email: emailKey ? String(row[emailKey]) : '',
                phone: phoneKey ? String(row[phoneKey]) : ''
            };

            await generateCertificate(selectedTemplate, mappedValues, true, bulkContact);
            setBulkProgress(prev => ({ ...prev, current: i + 1 }));
        }

        setIsGenerating(false);
        showToast(`Bulk generation complete! ${bulkData.length} files created.`, 'success');
        setBulkData([]);
        navigateTo('history');
    };

    // --- Render Sections ---
    const renderNav = () => (
        <nav className="cert-nav">
            <div className="nav-logo">
                <div className="logo-icon">🎓</div>
                CertEngine
            </div>
            <ul className="nav-links">
                <li><a onClick={() => window.location.href = '/admin'} style={{ color: 'var(--cert-accent)', fontWeight: 'bold', borderRight: '1px solid var(--cert-border)', paddingRight: '15px', marginRight: '5px', cursor: 'pointer' }}>← Admin Panel</a></li>
                <li><a onClick={() => navigateTo('dashboard')} className={activePage === 'dashboard' ? 'active' : ''}>Dashboard</a></li>
                <li><a onClick={() => navigateTo('templates')} className={activePage === 'templates' ? 'active' : ''}>Templates</a></li>
                <li><a onClick={() => navigateTo('generate')} className={activePage === 'generate' ? 'active' : ''}>Generate</a></li>
                <li><a onClick={() => navigateTo('history')} className={activePage === 'history' ? 'active' : ''}>History</a></li>
            </ul>
            <div className="nav-right">
                <User size={16} />
                <span>Main Admin</span>
            </div>
        </nav>
    );

    const startEditing = (template: Template) => {
        setSelectedTemplate(template);
        setEditingFields(template.fields || []);
        setActivePage('editor');
    };

    const renderDashboard = () => (
        <div className="page active" id="page-dashboard" style={{ padding: '36px 40px', flexDirection: 'column' }}>
            <div className="page-header">
                <h1>Dashboard Overview</h1>
                <p style={{ color: 'var(--cert-text2)', fontSize: '13px' }}>Monitor your certificate issuance and template usage</p>
            </div>
            <div className="stat-grid" style={{ marginTop: '10px' }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--cert-text3)' }}>Total Generated</div>
                        <div style={{ padding: '6px', background: 'rgba(79,142,247,0.1)', borderRadius: '6px', color: 'var(--cert-accent)' }}><FileBox size={14} /></div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{history.length}</div>
                    <div style={{ fontSize: '11px', color: 'var(--cert-accent3)', marginTop: '6px' }}>+12% from last month</div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--cert-text3)' }}>Active Templates</div>
                        <div style={{ padding: '6px', background: 'rgba(79,142,247,0.1)', borderRadius: '6px', color: 'var(--cert-accent)' }}><Files size={14} /></div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{templates.length}</div>
                    <div style={{ fontSize: '11px', color: 'var(--cert-text2)', marginTop: '6px' }}>Used across 4 events</div>
                </div>

            </div>
        </div>
    );

    const renderTemplates = () => (
        <div className="page active" id="page-templates" style={{ padding: '36px 40px', flexDirection: 'column' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Templates Library</h1>
                    <p style={{ color: 'var(--cert-text2)', fontSize: '13px' }}>Manage and edit your certificate base designs</p>
                </div>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                    <Plus size={16} /> New Template
                    <input type="file" hidden accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAddTemplate(file);
                    }} />
                </label>
            </div>
            <div className="templates-grid" style={{ marginTop: '10px' }}>
                {templates.map(t => (
                    <div key={t.id} className="template-card">
                        <div className="template-thumb">
                            <img src={t.image_url || ''} style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
                            <div className="template-overlay">
                                <button className="btn btn-ghost" style={{ background: '#fff', color: '#000' }} onClick={() => startEditing(t)}>Edit Design</button>
                            </div>
                        </div>
                        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '13px' }}>{t.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--cert-text3)' }}>{t.fields?.length || 0} fields mapped</div>
                            </div>
                            <button className="btn btn-ghost" style={{ color: 'var(--cert-danger)' }} onClick={async () => {
                                if (confirm('Delete this template? Warning: This will also remove metadata references.')) {
                                    const { error } = await supabase.from('certificate_templates').delete().eq('id', t.id);
                                    if (error) {
                                        console.error('Delete error:', error);
                                        showToast(`Cannot delete: ${error.message}`, 'error');
                                    } else {
                                        showToast('Template deleted successfully');
                                        fetchTemplates();
                                    }
                                }
                            }}><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEditor = () => (
        <div className="page active" id="page-editor">
            <div className="editor-left">
                <div style={{ padding: '14px', borderBottom: '1px solid var(--cert-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => navigateTo('templates')}>
                        <ChevronLeft size={14} /> Back
                    </button>
                    <span style={{ fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Editing: {selectedTemplate?.name}</span>
                </div>
                <div style={{ padding: '14px', flex: 1 }}>
                    <div className="editor-section-title" style={{ fontSize: '10px', color: 'var(--cert-text3)' }}>Templates Fields</div>
                    {['Recipient Name', 'Affiliation', 'Paper Title', 'Conference Name', 'Date', 'Venue', 'Category', 'Cert No', 'Verification QR'].map(f => (
                        <button key={f} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '4px', fontSize: '11px', padding: '10px' }} onClick={() => addField(f)}>
                            <Plus size={12} /> {f}
                        </button>
                    ))}

                    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <label className="btn btn-ghost" style={{ fontSize: '10px', padding: '8px', cursor: 'pointer', border: '1px dashed var(--cert-border2)' }}>
                            <Plus size={10} /> Signature
                            <input type="file" hidden accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleAssetUpload(file, 'signature');
                            }} />
                        </label>
                        <label className="btn btn-ghost" style={{ fontSize: '10px', padding: '8px', cursor: 'pointer', border: '1px dashed var(--cert-border2)' }}>
                            <Plus size={10} /> Logo
                            <input type="file" hidden accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleAssetUpload(file, 'logo');
                            }} />
                        </label>
                    </div>

                    {editingFields.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <div className="editor-section-title" style={{ fontSize: '10px', color: 'var(--cert-text3)' }}>Placed</div>
                            {editingFields.map(f => (
                                <div key={f.id} onClick={() => setSelectedFieldId(f.id)} style={{
                                    padding: '8px 12px', background: selectedFieldId === f.id ? 'rgba(79,142,247,0.1)' : 'var(--cert-surface2)',
                                    borderRadius: '6px', fontSize: '11px', marginBottom: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                                    border: selectedFieldId === f.id ? '1px solid var(--cert-accent)' : '1px solid transparent'
                                }}>
                                    <span>📌 {f.label}</span>
                                    <Trash2 size={10} onClick={(e) => { e.stopPropagation(); setEditingFields(editingFields.filter(fi => fi.id !== f.id)); if (selectedFieldId === f.id) setSelectedFieldId(null); }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ padding: '14px', borderTop: '1px solid var(--cert-border)' }}>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={saveTemplateChanges} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={14} /> : 'SAVE TEMPLATE'}
                    </button>
                </div>
            </div>

            <div className="editor-center">
                <div className="editor-toolbar" style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--cert-text2)' }}>Drag fields to position them on the template</div>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px' }}><Undo size={14} /> Undo</button>
                </div>
                <div className="canvas-wrapper" ref={canvasRef} style={{ background: '#fff', cursor: 'crosshair' }}>
                    {selectedTemplate?.image_url && (
                        <img src={selectedTemplate.image_url} style={{ width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none' }} crossOrigin="anonymous" />
                    )}
                    {editingFields.map(field => (
                        <div
                            key={field.id}
                            className={`canvas-field ${selectedFieldId === field.id ? 'selected' : ''}`}
                            style={{
                                top: `${field.y}%`,
                                left: `${field.x}%`,
                                fontSize: `${field.fontSize}px`,
                                fontWeight: field.fontWeight,
                                color: field.color,
                                fontFamily: field.fontFamily,
                                transform: 'translate(-50%, -50%)',
                                whiteSpace: 'pre',
                                zIndex: 10
                            }}
                            onMouseDown={(e) => {
                                setSelectedFieldId(field.id);
                                handleDrag(e, field.id);
                            }}
                        >
                            {selectedFieldId === field.id && <div style={{ position: 'absolute', top: '-18px', left: '0', fontSize: '9px', background: 'var(--cert-accent)', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>{field.label}</div>}
                            {selectedFieldId === field.id && (
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => handleResize(e, field.id)}
                                />
                            )}
                            {(field.type === 'signature' || field.type === 'logo') ? (
                                <img
                                    src={field.content}
                                    style={{ height: `${field.fontSize}px`, display: 'block' }}
                                    alt={field.label}
                                />
                            ) : field.type === 'verification-qr' ? (
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VERIFY-${field.id}`}
                                    style={{ width: `${field.fontSize}px`, height: `${field.fontSize}px`, display: 'block' }}
                                    alt="QR Preview"
                                />
                            ) : (
                                field.label
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="editor-right">
                <div style={{ padding: '14px', borderBottom: '1px solid var(--cert-border)' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--cert-text3)' }}>Properties</div>
                </div>
                {selectedFieldId ? (
                    <div style={{ padding: '14px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '10px', color: 'var(--cert-text3)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Font Family</label>
                            <select
                                className="stat-card" style={{ width: '100%', padding: '8px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '12px' }}
                                value={editingFields.find(f => f.id === selectedFieldId)?.fontFamily}
                                onChange={(e) => setEditingFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, fontFamily: e.target.value } : f))}
                            >
                                <optgroup label="Serif (Classic)">
                                    <option>Playfair Display</option>
                                    <option>Lora</option>
                                    <option>Cinzel</option>
                                    <option>Bodoni Moda</option>
                                    <option>Times New Roman</option>
                                </optgroup>
                                <optgroup label="Sans-Serif (Modern)">
                                    <option>Montserrat</option>
                                    <option>Open Sans</option>
                                    <option>Raleway</option>
                                    <option>Inter</option>
                                    <option>DM Sans</option>
                                </optgroup>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '10px', color: 'var(--cert-text3)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Size</label>
                                <input
                                    type="number"
                                    className="stat-card" style={{ width: '100%', padding: '8px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '12px' }}
                                    value={editingFields.find(f => f.id === selectedFieldId)?.fontSize}
                                    onChange={(e) => setEditingFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, fontSize: parseInt(e.target.value) } : f))}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '10px', color: 'var(--cert-text3)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Weight</label>
                                <select
                                    className="stat-card" style={{ width: '100%', padding: '8px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '12px' }}
                                    value={editingFields.find(f => f.id === selectedFieldId)?.fontWeight}
                                    onChange={(e) => setEditingFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, fontWeight: e.target.value } : f))}
                                >
                                    <option value="400">Normal</option>
                                    <option value="600">Semi-Bold</option>
                                    <option value="700">Bold</option>
                                    <option value="800">Black</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '10px', color: 'var(--cert-text3)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Color</label>
                            <input
                                type="color"
                                style={{ width: '100%', height: '32px', border: '1px solid var(--cert-border2)', background: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                value={editingFields.find(f => f.id === selectedFieldId)?.color}
                                onChange={(e) => setEditingFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, color: e.target.value } : f))}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '10px', color: 'var(--cert-text3)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>X (%)</label>
                                <input type="number" step="0.1" className="stat-card" style={{ width: '100%', padding: '8px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '12px' }} value={editingFields.find(f => f.id === selectedFieldId)?.x} onChange={(e) => setEditingFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, x: parseFloat(e.target.value) } : f))} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '10px', color: 'var(--cert-text3)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Y (%)</label>
                                <input type="number" step="0.1" className="stat-card" style={{ width: '100%', padding: '8px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '12px' }} value={editingFields.find(f => f.id === selectedFieldId)?.y} onChange={(e) => setEditingFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, y: parseFloat(e.target.value) } : f))} />
                            </div>
                        </div>
                        <button className="btn btn-danger" style={{ width: '100%', fontSize: '12px' }} onClick={() => {
                            setEditingFields(editingFields.filter(f => f.id !== selectedFieldId));
                            setSelectedFieldId(null);
                        }}>Remove Field</button>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', color: 'var(--cert-text3)' }}>
                        <Eye size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p style={{ fontSize: '12px' }}>Select a field on the canvas to edit its properties</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderGenerate = () => (
        <div className="page active" id="page-generate" style={{ padding: '36px 40px', flexDirection: 'column' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Generate Certificates</h1>
                    <p style={{ color: 'var(--cert-text2)', fontSize: '13px' }}>Select a template and recipient to create certificates</p>
                </div>
                {selectedTemplate && (
                    <button className="btn btn-ghost" onClick={() => { setSelectedTemplate(null); setSingleFieldValues({}); setBulkData([]); }}><ChevronLeft size={16} /> Change Template</button>
                )}
            </div>

            {!selectedTemplate ? (
                <div className="templates-grid" style={{ marginTop: '10px' }}>
                    {templates.length === 0 && <div style={{ gridColumn: '1/-1', padding: '40px', textAlign: 'center', color: 'var(--cert-text2)' }}>No templates found. Please upload one first.</div>}
                    {templates.map(t => (
                        <div key={t.id} className="template-card" onClick={() => { setSelectedTemplate(t); }} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                            <div className="template-thumb" style={{ height: '140px' }}>
                                <img src={t.image_url || ''} style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
                            </div>
                            <div style={{ padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>{t.name}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 450px) 1fr', gap: '30px', marginTop: '10px' }}>
                    {/* Form Column */}
                    <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="tab-row">
                            <div className={`tab ${genMode === 'single' ? 'active' : ''}`} onClick={() => setGenMode('single')}>Single</div>
                            <div className={`tab ${genMode === 'bulk' ? 'active' : ''}`} onClick={() => setGenMode('bulk')}>Bulk (Excel)</div>
                        </div>

                        {genMode === 'single' ? (
                            <div className="stat-card" style={{ padding: '20px', borderTop: '2px solid var(--cert-accent)' }}>
                                <h3 style={{ fontSize: '14px', marginBottom: '20px' }}>Certificate Information</h3>
                                {selectedTemplate.fields
                                    .filter(f => !['verification-qr', 'signature', 'logo'].includes(f.type)) // Hide static assets from input form
                                    .map(field => (
                                        <div key={field.id} style={{ marginBottom: '15px' }}>
                                            <label style={{ fontSize: '11px', color: 'var(--cert-text2)', marginBottom: '6px', display: 'block' }}>{field.label}</label>
                                            {field.label.includes('Category') ? (
                                                <select
                                                    className="stat-card" style={{ width: '100%', padding: '10px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '13px' }}
                                                    value={singleFieldValues[field.id] || ''}
                                                    onChange={(e) => setSingleFieldValues({ ...singleFieldValues, [field.id]: e.target.value })}
                                                >
                                                    <option value="">Select Category</option>
                                                    <option>Presenter</option>
                                                    <option>Keynote Speaker</option>
                                                    <option>Listener</option>
                                                    <option>Organizing Committee</option>
                                                </select>
                                            ) : (
                                                <input
                                                    className="stat-card" style={{ width: '100%', padding: '10px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '13px' }}
                                                    placeholder={`Enter ${field.label}`}
                                                    value={singleFieldValues[field.id] || ''}
                                                    onChange={(e) => setSingleFieldValues({ ...singleFieldValues, [field.id]: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    ))}

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--cert-text2)', marginBottom: '6px', display: 'block' }}>Recipient Email</label>
                                    <input
                                        className="stat-card" style={{ width: '100%', padding: '10px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '13px' }}
                                        placeholder="Enter Email (optional)"
                                        value={contactInfo.email}
                                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--cert-text2)', marginBottom: '6px', display: 'block' }}>Recipient Phone (WhatsApp)</label>
                                    <input
                                        className="stat-card" style={{ width: '100%', padding: '10px', background: 'var(--cert-bg)', border: '1px solid var(--cert-border2)', color: 'white', fontSize: '13px' }}
                                        placeholder="e.g. 919876543210"
                                        value={contactInfo.phone}
                                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}
                                    onClick={() => generateCertificate(selectedTemplate, singleFieldValues, true)}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <><Download size={16} /> Generate & Download</>}
                                </button>
                            </div>
                        ) : (
                            <div className="stat-card" style={{ padding: '24px', textAlign: 'center' }}>
                                <FileBox size={40} style={{ margin: '0 auto 16px', color: 'var(--cert-accent)' }} />
                                <h3>Bulk Generation</h3>
                                <p style={{ fontSize: '12px', color: 'var(--cert-text2)', margin: '8px 0 20px' }}>Upload an Excel file with columns matching your template fields</p>
                                <label className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', cursor: 'pointer', padding: '20px' }}>
                                    <Upload size={18} /> {bulkData.length > 0 ? `${bulkData.length} records loaded` : 'Choose Excel File'}
                                    <input type="file" hidden accept=".xlsx,.xls" onChange={handleBulkUpload} />
                                </label>
                                {bulkData.length > 0 && (
                                    <div style={{ marginTop: '16px' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--cert-text3)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Progress</span>
                                            <span>{bulkProgress.current} / {bulkProgress.total}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '4px', background: 'var(--cert-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', background: 'var(--cert-accent)', width: `${(bulkProgress.current / bulkProgress.total) * 100}%`, transition: 'width 0.3s' }} />
                                        </div>
                                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={startBulkGeneration} disabled={isGenerating}>
                                            {isGenerating ? `Generating... (${bulkProgress.current}/${bulkProgress.total})` : 'Start Generation'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Preview Column (UI ONLY) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--cert-text3)', letterSpacing: '1px' }}>Live Preview</div>
                            <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setShowPreviewModal(true)}>
                                <Eye size={14} style={{ marginRight: '4px' }} /> Full Screen
                            </button>
                        </div>
                        <div className="stat-card" style={{ padding: '12px', background: '#000', borderRadius: '14px', border: '1px solid var(--cert-border2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '1.414/1',
                                background: '#fff',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '1200px',
                                    height: '848px',
                                    transform: 'translate(-50%, -50%) scale(0.6)',
                                    transformOrigin: 'center center',
                                    pointerEvents: 'none'
                                }}>
                                    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#fff' }}>
                                        {selectedTemplate.image_url && <img src={selectedTemplate.image_url} style={{ width: '100%', height: '100%', objectFit: 'fill' }} crossOrigin="anonymous" />}
                                        {selectedTemplate.fields.map(field => (
                                            <div key={field.id} style={{
                                                position: 'absolute',
                                                top: `${field.y}%`,
                                                left: `${field.x}%`,
                                                fontSize: `${field.fontSize * 1.25}px`,
                                                fontWeight: field.fontWeight,
                                                color: field.color,
                                                fontFamily: field.fontFamily,
                                                transform: 'translate(-50%, -50%)',
                                                whiteSpace: 'pre'
                                            }}>
                                                {(field.type === 'signature' || field.type === 'logo') ? (
                                                    <img
                                                        src={field.content}
                                                        style={{ height: `${field.fontSize * 1.25}px`, display: 'block' }}
                                                        alt={field.label}
                                                    />
                                                ) : field.type === 'verification-qr' ? (
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PREVIEW`}
                                                        style={{ width: `${field.fontSize}px`, height: `${field.fontSize}px`, display: 'block' }}
                                                        alt="QR Preview"
                                                    />
                                                ) : (
                                                    singleFieldValues[field.id] || field.label
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="cert-engine-container">
            {toast && (
                <div className="cert-toast-container">
                    <div className={`cert-toast ${toast.type}`}>
                        {toast.type === 'success' ? <CheckCircle size={16} color="var(--cert-success)" /> : <AlertTriangle size={16} color="var(--cert-danger)" />}
                        <span>{toast.msg}</span>
                    </div>
                </div>
            )}
            {renderNav()}

            <div className="app-layout">
                {activePage === 'dashboard' && renderDashboard()}
                {activePage === 'templates' && renderTemplates()}
                {activePage === 'editor' && renderEditor()}
                {activePage === 'generate' && renderGenerate()}
                {activePage === 'history' && (
                    <div className="page active" style={{ padding: '36px 40px', flexDirection: 'column' }}>
                        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1>Generated History</h1>
                                <p style={{ color: 'var(--cert-text2)', fontSize: '13px' }}>All certificates generated via single or bulk mode</p>
                            </div>
                        </div>
                        <div className="stat-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--cert-surface2)', textAlign: 'left', fontSize: '10px', color: 'var(--cert-text3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <th style={{ padding: '16px' }}>Recipient</th>
                                        <th>Template</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th style={{ textAlign: 'center' }}>Distribute</th>
                                        <th style={{ textAlign: 'right', paddingRight: '20px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length === 0 && <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--cert-text2)' }}>No history found</td></tr>}
                                    {history.map(h => (
                                        <tr key={h.id} style={{ borderBottom: '1px solid var(--cert-border)', fontSize: '13px' }}>
                                            <td style={{ padding: '14px' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--cert-text)' }}>{h.recipient_name}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--cert-text2)' }}>{h.id.slice(0, 8)}</div>
                                            </td>
                                            <td>{h.template_name}</td>
                                            <td><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(79,142,247,0.1)', color: 'var(--cert-accent)', fontSize: '11px' }}>{h.category}</span></td>
                                            <td>{h.created_at}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                                    <button
                                                        className="btn btn-ghost"
                                                        style={{ padding: '6px', color: h.recipient_phone ? '#25D366' : 'var(--cert-text3)', opacity: h.recipient_phone ? 1 : 0.4 }}
                                                        onClick={() => handleWhatsAppShare(h)}
                                                        title={h.recipient_phone ? `Share with ${h.recipient_phone}` : 'No phone recorded'}
                                                    >
                                                        <MessageCircle size={14} />
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost"
                                                        style={{ padding: '6px', color: h.recipient_email ? '#4F8EF7' : 'var(--cert-text3)', opacity: h.recipient_email ? 1 : 0.4 }}
                                                        onClick={() => handleEmailShare(h)}
                                                        title={h.recipient_email ? `Email to ${h.recipient_email}` : 'No email recorded'}
                                                        disabled={sendingEmailId === h.id}
                                                    >
                                                        {sendingEmailId === h.id ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                                <a href={h.file_url} download target="_blank" className="btn btn-ghost" style={{ padding: '6px' }}><Download size={14} /></a>
                                                <button className="btn btn-ghost" style={{ padding: '6px', marginLeft: '6px' }} onClick={async () => {
                                                    if (confirm('Delete history record?')) {
                                                        await supabase.from('generated_certificates').delete().eq('id', h.id);
                                                        fetchHistory();
                                                    }
                                                }}><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {selectedTemplate && showPreviewModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 3000,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setShowPreviewModal(false)}>
                    <button className="btn btn-ghost" style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '8px' }} onClick={() => setShowPreviewModal(false)}>
                        <X size={24} />
                    </button>
                    <div style={{
                        width: '1200px', height: '848px',
                        background: '#fff', position: 'relative',
                        transform: 'scale(0.85)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        borderRadius: '8px', overflow: 'hidden'
                    }} onClick={e => e.stopPropagation()}>
                        {selectedTemplate.image_url && <img src={selectedTemplate.image_url} style={{ width: '100%', height: '100%', objectFit: 'fill' }} crossOrigin="anonymous" />}
                        {selectedTemplate.fields.map(field => (
                            <div key={field.id} style={{
                                position: 'absolute',
                                top: `${field.y}%`,
                                left: `${field.x}%`,
                                fontSize: `${field.fontSize * 1.25}px`,
                                fontWeight: field.fontWeight,
                                color: field.color,
                                fontFamily: field.fontFamily,
                                transform: 'translate(-50%, -50%)',
                                whiteSpace: 'pre'
                            }}>
                                {field.type === 'signature' || field.type === 'logo' ? (
                                    <img
                                        src={field.content}
                                        style={{ height: `${field.fontSize * 1.25}px`, display: 'block' }}
                                        alt={field.label}
                                        crossOrigin="anonymous"
                                    />
                                ) : field.type === 'verification-qr' ? (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PREVIEW`}
                                        style={{ width: `${field.fontSize * 1.25}px`, height: `${field.fontSize * 1.25}px`, display: 'block' }}
                                        alt="QR Preview"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    singleFieldValues[field.id] || field.label
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )
            }

            {/* --- ACTUAL CAPTURE AREA (Hidden from View, 1:1 Scale) --- */}
            <div style={{
                position: 'fixed',
                top: '-10000px',
                left: '-10000px',
                width: '1200px',
                height: '848px',
                zIndex: -1,
                pointerEvents: 'none',
                opacity: 0.01,
                overflow: 'hidden'
            }}>
                {/* Preload Fonts for Capture */}
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Montserrat:wght@400;600;700&family=Lora:wght@400;700&family=Cinzel:wght@400;700&family=Bodoni+Moda:wght@400;700&family=Open+Sans:wght@400;700&family=Raleway:wght@400;700&family=DM+Sans:wght@400;700&display=swap" rel="stylesheet" />

                <div ref={hiddenCanvasRef} style={{
                    width: '1200px',
                    height: '848px',
                    position: 'relative',
                    background: '#ffffff',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                }}>
                    {selectedTemplate?.image_url && (
                        <img
                            src={selectedTemplate.image_url}
                            style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                            crossOrigin="anonymous"
                            alt="Template"
                        />
                    )}
                    {selectedTemplate?.fields.map(field => (
                        <div
                            key={`capture-${field.id}`}
                            data-field-type={field.type}
                            style={{
                                position: 'absolute',
                                top: `${field.y}%`,
                                left: `${field.x}%`,
                                fontSize: `${field.fontSize * 1.25}px`,
                                fontWeight: field.fontWeight,
                                color: field.color,
                                fontFamily: field.fontFamily || 'serif',
                                transform: 'translate(-50%, -50%)',
                                whiteSpace: 'pre',
                                lineHeight: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center'
                            }}
                        >
                            {field.type === 'signature' || field.type === 'logo' ? (
                                <img
                                    src={field.content}
                                    style={{ height: `${field.fontSize * 1.25}px` }}
                                    crossOrigin="anonymous"
                                />
                            ) : field.type === 'verification-qr' ? (
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${CONFERENCE_CONFIG.urls.canonical || window.location.origin}/verify/${currentVerificationId || 'PENDING'}`)}`}
                                    style={{ width: `${field.fontSize * 1.25}px`, height: `${field.fontSize * 1.25}px` }}
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                singleFieldValues[field.id] || `{${field.label}}`
                            )}
                        </div>
                    ))}
                </div>
            </div >
        </div >
    );
}
