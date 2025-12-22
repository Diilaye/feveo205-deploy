import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Eye, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-custom.css';
const ArticleEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [formData, setFormData] = useState({
        titre: '',
        resume: '',
        contenu: '',
        image: '',
        images: [],
        video: '',
        categorie: 'annonce',
        tags: [],
        statut: 'brouillon',
        vedette: false,
        tempsLecture: '5 min'
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tagInput, setTagInput] = useState('');
    const categories = [
        { value: 'annonce', label: 'Annonce' },
        { value: 'investissement', label: 'Investissement' },
        { value: 'gie', label: 'GIE' },
        { value: 'partenariat', label: 'Partenariat' },
        { value: 'formation', label: 'Formation' },
        { value: 'technologie', label: 'Technologie' },
        { value: 'territoire', label: 'Territoire' },
        { value: 'impact', label: 'Impact Social' },
        { value: 'innovation', label: 'Innovation' },
        { value: 'certification', label: 'Certification' },
        { value: 'evenement', label: 'Événement' },
        { value: 'finance', label: 'Finance' }
    ];
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ]
    };
    useEffect(() => {
        if (isEdit) {
            loadArticle();
        }
    }, [id]);
    const loadArticle = async () => {
        try {
            const token = localStorage.getItem('journaliste_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051';
            const response = await axios.get(`${API_URL}/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const article = response.data.article;
            setFormData({
                titre: article.titre,
                resume: article.resume || '',
                contenu: article.contenu || '',
                image: article.image,
                images: article.images || [],
                video: article.video || '',
                categorie: article.categorie,
                tags: article.tags || [],
                statut: article.statut,
                vedette: article.vedette || false,
                tempsLecture: article.tempsLecture
            });
        }
        catch (error) {
            console.error('Erreur lors du chargement:', error);
            setError('Erreur lors du chargement de l\'article');
        }
    };
    const handleFilesUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0)
            return;
        setUploading(true);
        setError('');
        try {
            const token = localStorage.getItem('journaliste_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051';
            const formDataUpload = new FormData();
            Array.from(files).forEach(file => {
                formDataUpload.append('files', file);
            });
            const response = await axios.post(`${API_URL}/articles/upload-files`, formDataUpload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            const uploadedFiles = response.data.files;
            const imageUrls = [];
            let videoUrl = '';
            uploadedFiles.forEach((file) => {
                const fullUrl = `${API_URL}${file.url}`;
                if (file.type === 'image') {
                    imageUrls.push(fullUrl);
                }
                else if (file.type === 'video') {
                    videoUrl = fullUrl;
                }
            });
            setFormData(prev => ({
                ...prev,
                image: prev.image || imageUrls[0] || '',
                images: [...prev.images, ...imageUrls],
                video: videoUrl || prev.video
            }));
        }
        catch (error) {
            console.error('Erreur upload:', error);
            setError(error.response?.data?.message || 'Erreur lors de l\'upload des fichiers');
        }
        finally {
            setUploading(false);
        }
    };
    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            newImages.splice(index, 1);
            return {
                ...prev,
                images: newImages,
                image: newImages[0] || ''
            };
        });
    };
    const removeVideo = () => {
        setFormData(prev => ({ ...prev, video: '' }));
    };
    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };
    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };
    const handleSubmit = async (e, statut) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!formData.titre || !formData.image) {
                setError('Le titre et au moins une image sont obligatoires');
                setLoading(false);
                return;
            }
            const token = localStorage.getItem('journaliste_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051';
            const dataToSend = {
                ...formData,
                statut: statut || formData.statut
            };
            if (isEdit) {
                await axios.put(`${API_URL}/articles/${id}`, dataToSend, { headers: { Authorization: `Bearer ${token}` } });
            }
            else {
                await axios.post(`${API_URL}/articles`, dataToSend, { headers: { Authorization: `Bearer ${token}` } });
            }
            navigate('/journaliste/dashboard');
        }
        catch (error) {
            console.error('Erreur:', error);
            setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-neutral-50", children: [_jsx("header", { className: "bg-white border-b border-neutral-200", children: _jsx("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("button", { onClick: () => navigate('/journaliste/dashboard'), className: "flex items-center gap-2 text-neutral-600 hover:text-neutral-900", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), "Retour au dashboard"] }), _jsx("h1", { className: "text-xl font-bold text-neutral-900", children: isEdit ? 'Éditer l\'article' : 'Nouvel article' })] }) }) }), _jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [error && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-red-700", children: error })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-3", children: "Images et/ou Vid\u00E9o * (au moins une image requise)" }), _jsxs("label", { className: "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50", children: [_jsx("div", { className: "flex flex-col items-center justify-center py-10", children: uploading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-4" }), _jsx("p", { className: "text-sm text-neutral-600", children: "Upload en cours..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Upload, { className: "w-12 h-12 text-neutral-400 mb-4" }), _jsx("p", { className: "text-sm text-neutral-600 mb-1", children: "Cliquez pour uploader des images et/ou une vid\u00E9o" }), _jsx("p", { className: "text-xs text-neutral-500", children: "Images: PNG, JPG, GIF, WEBP \u2022 Vid\u00E9os: MP4, WEBM, MOV" }), _jsx("p", { className: "text-xs text-neutral-500 mt-1", children: "Jusqu'\u00E0 10 fichiers, 50MB max" })] })) }), _jsx("input", { type: "file", accept: "image/*,video/*", multiple: true, onChange: handleFilesUpload, className: "hidden" })] }), formData.images.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsxs("h3", { className: "text-sm font-medium text-neutral-700 mb-3", children: ["Images (", formData.images.length, ")"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: formData.images.map((img, index) => (_jsxs("div", { className: "relative group", children: [_jsx("img", { src: img, alt: `Image ${index + 1}`, className: "w-full h-32 object-cover rounded-lg" }), _jsx("button", { type: "button", onClick: () => removeImage(index), className: "absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(X, { className: "w-4 h-4" }) }), index === 0 && (_jsx("span", { className: "absolute bottom-2 left-2 px-2 py-1 bg-accent-500 text-white text-xs rounded", children: "Principale" }))] }, index))) })] })), formData.video && (_jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "text-sm font-medium text-neutral-700 mb-3", children: "Vid\u00E9o" }), _jsxs("div", { className: "relative", children: [_jsx("video", { src: formData.video, controls: true, className: "w-full max-w-md h-48 object-cover rounded-lg" }), _jsx("button", { type: "button", onClick: removeVideo, className: "absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600", children: _jsx(X, { className: "w-5 h-5" }) })] })] }))] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-3", children: "Titre de l'article *" }), _jsx("input", { type: "text", value: formData.titre, onChange: (e) => setFormData({ ...formData, titre: e.target.value }), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent", placeholder: "Un titre accrocheur...", required: true })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-3", children: "R\u00E9sum\u00E9 (optionnel)" }), _jsx("textarea", { value: formData.resume, onChange: (e) => setFormData({ ...formData, resume: e.target.value }), rows: 3, className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent", placeholder: "Un r\u00E9sum\u00E9 court et percutant..." })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-3", children: "Contenu de l'article (optionnel)" }), _jsx(ReactQuill, { theme: "snow", value: formData.contenu, onChange: (value) => setFormData({ ...formData, contenu: value }), modules: quillModules, className: "bg-white", placeholder: "R\u00E9digez votre article ici..." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-3", children: "Cat\u00E9gorie" }), _jsx("select", { value: formData.categorie, onChange: (e) => setFormData({ ...formData, categorie: e.target.value }), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent", children: categories.map(cat => (_jsx("option", { value: cat.value, children: cat.label }, cat.value))) })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-3", children: "Temps de lecture" }), _jsx("input", { type: "text", value: formData.tempsLecture, onChange: (e) => setFormData({ ...formData, tempsLecture: e.target.value }), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent", placeholder: "5 min" })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-3", children: "Tags (optionnel)" }), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx("input", { type: "text", value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag()), className: "flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent", placeholder: "Ajouter un tag..." }), _jsx("button", { type: "button", onClick: handleAddTag, className: "px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300", children: "Ajouter" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: formData.tags.map(tag => (_jsxs("span", { className: "px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm flex items-center gap-2", children: [tag, _jsx("button", { type: "button", onClick: () => handleRemoveTag(tag), className: "hover:text-accent-900", children: "\u00D7" })] }, tag))) })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6", children: _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: formData.vedette, onChange: (e) => setFormData({ ...formData, vedette: e.target.checked }), className: "w-5 h-5 text-accent-500 focus:ring-accent-500 rounded" }), _jsx("span", { className: "text-sm font-medium text-neutral-700", children: "Mettre en vedette (article \u00E0 la une)" })] }) }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("button", { type: "button", onClick: (e) => handleSubmit(e, 'brouillon'), disabled: loading, className: "flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50", children: [_jsx(Save, { className: "w-5 h-5" }), "Enregistrer comme brouillon"] }), _jsx("button", { type: "button", onClick: (e) => handleSubmit(e, 'publie'), disabled: loading, className: "flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Enregistrement..."] })) : (_jsxs(_Fragment, { children: [_jsx(Eye, { className: "w-5 h-5" }), "Publier l'article"] })) })] })] })] })] }));
};
export default ArticleEditor;
//# sourceMappingURL=ArticleEditor.js.map