import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Modal, Button, Form, ModalBody, FormControl, InputGroup, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faSignOutAlt, faUser, faFilm, faBook, faHome, faSignInAlt, faToggleOff, faToggleOn, faTrash, faSearch, faLanguage, faChartBar, faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import './admin.css';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import logo1 from './logo1.jpg';
import SidebarSection from './SidebarSection';
import Switch from 'react-switch';
import { v4 as uuidv4 } from 'uuid';
import { faEye, faEyeSlash, faChartLine } from '@fortawesome/free-solid-svg-icons';
import {  Typography, CircularProgress, Alert, Card, CardContent, CardHeader, Avatar } from '@mui/material';


import { useTranslation } from 'react-i18next';
import i18n from '../utils/i18n.js';

import UserStatsChart from './UserStatsChart';

import sciencemat from './sciencemat.PNG';
import langue from './langue.PNG';
import computer from './computer.PNG';
import art from './art.PNG';
import nedia from './nedia.PNG';
import economic from './economic.PNG';
import langpsycho from './psycho.PNG';
import cuisine from './cuisine.PNG';
import maquillage from './maquillage.PNG';


const AdminComponent = () => {
  const { t, i18n } = useTranslation('ad');
  const navigate = useNavigate();
  const footerRef = useRef();

  const languages = ['English', 'Français', 'عربية'];
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [option, setOption] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [fichiers, setFichiers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const audioRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('catalogue');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const categories = [
    { id: 1, name: t('Sciences et Mathématiques'), image: sciencemat },
    { id: 2, name: t('Langues'), image: langue },
    { id: 3, name: t('Informatique et Technologie'), image: computer },
    { id: 4, name: t('Arts et culture'), image: art },
    { id: 5, name: t('Développement Personnel'), image: nedia },
    { id: 6, name: t('Affaires et Économie'), image: economic },
    { id: 7, name: t('Sciences sociales'), image: langpsycho },
    { id: 8, name: t('Cuisine'), image: cuisine },
    { id: 9, name: t('Maquillage'), image: maquillage }
  ];
  const [user, setUser] = useState({});


  const Sidebar = () => {
    const { t } = useTranslation('ad'); // Assurez-vous d'ajuster la clé de traduction si nécessaire

    return (
      <div className="sidebar2">
        <div className='brand'>
          <br /> <img src={logo1} alt="logo1" /> <br /><br /><br />
        </div>
        <div className={option === 'dashboard' ? 'active' : ''} onClick={() => setOption('dashboard')}>
          <FontAwesomeIcon icon={faChartLine} /> {t('Tableau de bord')}
        </div><br />
        <div className={option === 'profile' ? 'active' : ''} onClick={() => setOption('profile')}>
        <FontAwesomeIcon icon={faUser} /> {t('Mon profile')}
  </div><br />
        <div className={option === 'users' ? 'active' : ''} onClick={() => setOption('users')}>
          <FontAwesomeIcon icon={faUser} /> {t('gestion_utilisateurs')}
        </div><br />
        <div className={option === 'videos' ? 'active' : ''} onClick={() => setOption('videos')}>
          <FontAwesomeIcon icon={faFilm} /> {t('gestion_videos_audios')}
        </div><br />
        <div className={option === 'ressources' ? 'active' : ''} onClick={() => setOption('cours')}>
          <FontAwesomeIcon icon={faBook} /> {t('gestion_cours')}
        </div><br />
        <div className={option === 'quiz' ? 'active' : ''} onClick={() => setOption('quiz')}>
          <FontAwesomeIcon icon={faQuestionCircle} /> {t('gestion des quiz')}
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (option === 'quiz') {
          const response = await axios.get('http://localhost:3001/api/quizzes');
          setQuizzes(response.data.quizzes);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des quiz :', error);
      }
    };

    fetchQuizzes();
  }, [option]);



  useEffect(() => {
    if (selectedQuiz && audioRef.current) {
      audioRef.current.play(); // Démarrage de la musique lorsque la modal est ouverte
    }
  }, [selectedQuiz]);



  const [userData, setUserData] = useState({
    nom: '',
    email: '',
    langue: '',
    mdp: '',
    role: 'apprenant', // par défaut
    dateNaiss: '',
    statut: '',
    niveau: '',
    ville: '',
    poste: '',
    etablissement: '',
    specialite: '',
    tel: '',

  });

  const [showPassword, setShowPassword] = useState(false);

  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleAnswerSelection = (suggestion, correctAnswer) => {
    // Ajoutez votre logique pour gérer la sélection de réponse ici
    console.log('Réponse sélectionnée :', suggestion);
    console.log('Réponse correcte :', correctAnswer);
  };
  const quizCompleted = true; // Vous pouvez initialiser à false ou à la valeur par défaut appropriée


  // Fonction pour gérer la fin du quiz
  const handleFinishQuiz = () => {
    // Ajoutez votre logique pour terminer le quiz ici
    console.log('Quiz terminé !');
  };


  const ChangeEn = () => {
    i18n.changeLanguage("en");
  };

  const ChangeFr = () => {
    i18n.changeLanguage("fr");
  };


  const ChangeAr = () => {
    i18n.changeLanguage("ar");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAddUser = async () => {
    try {
      const apiUrl = userData.role === 'apprenant' ? 'http://localhost:3001/api/registerA' : 'http://localhost:3001/api/registerI';
      const response = await axios.post(apiUrl, { ...userData, id: uuidv4() });

      if (response.data === 'Email déjà existant') {
        toast.error('L\'adresse e-mail existe déjà. Merci de la changer.');
      } else {
        const successMessage = userData.role === 'apprenant' ? 'Inscription apprenant réussie !' : 'Inscription instructeur réussie !';
        toast.success(successMessage);

        // Créer un nouvel utilisateur avec les données actuellement saisies
        const newUser = { ...userData, id: uuidv4(), etat: 'actif' };

        // Ajouter le nouvel utilisateur à la liste des utilisateurs
        setUsers(prevUsers => [...prevUsers, newUser]); // Mettre à jour l'état local des utilisateurs

        // Réinitialiser les données du formulaire après une inscription réussie
        setUserData({
          nom: '',
          email: '',
          langue: '',
          mdp: '',
          role: 'apprenant',
          dateNaiss: '',
          statut: '',
          niveau: '',
          ville: '',
          poste: '',
          etablissement: '',
          specialite: '',
          tel: '',

        });

        setShowModal(false); // Fermer le modal après inscription réussie
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données au serveur :', error);
      const errorMessage = userData.role === 'apprenant' ? 'Erreur lors de l\'inscription apprenant' : 'Erreur lors de l\'inscription instructeur';
      toast.error(errorMessage);
    }
  };


  useEffect(() => {
    if (option === 'users') {
      fetchUsers();
    } else if (option === 'videos') {
      fetchVideos();
    }
  }, [option]);
  useEffect(() => {
    if (searchTerm.trim() !== '') {
      axios.get('/api/searchUser/${searchTerm}')
        .then(response => {
          const { success, users } = response.data;
          if (success && users) {
            setSearchResults(users);
          } else {
            setSearchResults([]);
          }
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);
  useEffect(() => {
    if (searchTerm2.trim() !== '') {
      // Faites une requête à votre API avec le terme de recherche
      axios.get('/api/searchVideo/${searchTerm2}')
        .then(response => {
          setSearchResults2(response.data.videos);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
        });
    } else {
      setSearchResults2([]); // Réinitialiser les résultats de recherche s'il n'y a aucun terme de recherche
    }
  }, [searchTerm2]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };
  const handleItemClick = (item) => {
    console.log('Option "${item}" clicked');
    // Ajoutez ici la logique pour traiter la sélection de l'option
  };
  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getFichiers');
      setFichiers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos:', error);
    }
  };
  const deleteFile = (fichierId) => {

    if (fichierId) {

      Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer ce fichier ?',
        text: "Cette action est irréversible !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745', // Vert
        cancelButtonColor: '#dc3545', // Rouge
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        // Vérifier si l'utilisateur a confirmé la suppression
        if (result.isConfirmed) {
          axios.delete(`http://localhost:3001/api/deleteFichier/${fichierId}`)
            .then(response => {
              console.log(response.data);
              const updatedFichiers = fichiers.filter(fichier => fichier.id_fichier !== fichierId);
              setFichiers(updatedFichiers);

              // Afficher un message de confirmation à l'utilisateur avec toast
              toast.success('Le fichier a été supprimée avec succès');
            })
            .catch(error => {
              console.error('Erreur lors de la suppression du fichier:', error);
              // Gérer les erreurs de suppression ici
            });
        }
      });
    } else {
      console.error("ID de fichier non défini :", fichierId);
    }
  };
  const handleSearch = async () => {
    // Partie concernant la gestion de la recherche des utilisateurs
    try {
      const response = await axios.get(`http://localhost:3001/api/searchUser/${searchTerm}`);
      const { success, users } = response.data; // Utiliser "users" au lieu de "user"
      if (success && users) {
        setSearchResults(users); // Utiliser "users" au lieu de "user"
      } else {
        console.log('Aucun utilisateur trouvé.');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', error);
    }

    // Partie concernant la gestion de la recherche des vidéos
    try {
      const response = await axios.get(`http://localhost:3001/api/searchFichier/${searchTerm2}`);
      const { success, fichiers } = response.data; // Utiliser "videos" au lieu de "user"
      if (success) {
        setSearchResults2(fichiers); // Utiliser "videos" au lieu de "user"
      } else {
        console.log('Aucune fichier trouvée.');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de fichiers:', error);
    }

  };
  const handleFichierSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/searchFichier/${searchTerm2}`);
      const { success, fichiers } = response.data;
      if (success) {
        setSearchResults2(fichiers);
      } else {
        console.log('Aucune fichier trouvée.');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de fichiers:', error);
    }
  };
  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    // Mettre ici toute logique supplémentaire nécessaire
  };
  const toggleUserStatus = async (userId, currentStatus, userType) => {
    try {

      const newStatus = currentStatus === 'actif' ? 'inactif' : 'actif';
      const apiUrl = userType === 'apprenant' ? `http://localhost:3001/api/apprenants/${userId}/etat` : `http://localhost:3001/api/instructeurs/${userId}/etat`;
      const response = await axios.put(apiUrl, { etat: newStatus });

      // Mettre à jour l'état de l'utilisateur localement dans le tableau users
      setUsers(users.map(user => user._id === userId ? { ...user, etat: newStatus } : user));

      // Mettre à jour l'état de l'utilisateur localement dans le tableau searchResults
      setSearchResults(searchResults.map(user => user._id === userId ? { ...user, etat: newStatus } : user));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état de l\'utilisateur:', error);
    }
  };
  const fetchFileByName = async (fileName) => {
    try {
      const response = await fetch('http://localhost:3001/api/files/' + fileName);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du fichier');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Personnalisation des styles CSS pour agrandir le toast
      const customToastStyle = {
        maxWidth: '150%', // Largeur maximale du toast
        height: '150%', // Hauteur du toast
        overflow: 'auto' // Ajout d'un défilement si le contenu dépasse la taille du toast
      };

      // Afficher le contenu multimédia dans un toast avec les styles personnalisés
      toast.success(
        <div style={customToastStyle}>
          {fileName.endsWith('.mp3') ? (
            <audio controls style={{ width: '100%' }}>
              <source src={url} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          ) : fileName.endsWith('.mp4') ? (
            <video controls style={{ width: '100%' }}>
              <source src={url} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          ) : (
            <p>Fichier non pris en charge</p>
          )}
        </div>,
        { autoClose: false } // Ne pas fermer automatiquement le toast
      );
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/logout'); // Appeler votre API de déconnexion

      if (response.data.success) {
        // Si la déconnexion est réussie, rediriger vers la page d'accueil
        sessionStorage.setItem('token', '');
        sessionStorage.setItem('user', {});
        navigate('/');
      } else {
        // Sinon, afficher un message d'erreur ou gérer l'erreur selon votre cas
        console.error('Erreur lors de la déconnexion :', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };



  const handleDeleteQuiz = async (quizId) => {
    try {
      // Affiche une boîte de dialogue de confirmation
      const confirmResult = await Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer ce quiz ?',
        text: 'Cette action est irréversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745', // Vert
        cancelButtonColor: '#dc3545', // Rouge
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler'
      });

      // Si l'utilisateur confirme la suppression
      if (confirmResult.isConfirmed) {
        // Envoie une requête DELETE à l'API backend pour supprimer le quiz
        const response = await fetch(`http://localhost:3001/api/supQ/${quizId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Vérifie le statut de la réponse
        if (response.ok) {
          // Supprime le quiz de l'affichage
          setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
          toast.success("Le quiz a été supprimé avec succès."); // Affiche un message de succès
        } else {
          // Si la réponse n'est pas réussie, lance une erreur avec le statut de la réponse
          throw new Error(`Erreur lors de la suppression du quiz : ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du quiz :', error.message);
      // Gérez les erreurs en conséquence (par exemple, affichez un message d'erreur à l'utilisateur)
    }
  }


  const handleViewFile = (fileName) => {
    // Effectuer une requête GET vers l'API pour récupérer le contenu du fichier
    fetch(`http://localhost:3001/api/file-content?fileName=${fileName}`)
      .then(response => {
        // Vérifier si la réponse est réussie
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du fichier');
        }
        // Récupérer le contenu du fichier à partir de la réponse
        return response.text();
      })
      .then(fileContent => {
        // Ouvrir une nouvelle fenêtre ou un nouvel onglet avec le contenu du fichier
        const newWindow = window.open();
        newWindow.document.write(`
          <html>
            <head>
              <title>Contenu du fichier</title>
            </head>
            <body>
              <p><span style="font-weight: bold; color: blue;">Le contenu du fichier est :</span></p>
              <pre>${fileContent}</pre>
            </body>
          </html>
        `);
      })
      .catch(error => {
        // Gérer les erreurs
        console.error('Erreur lors de la récupération du fichier :', error);
        // Afficher un message d'erreur à l'utilisateur
        alert('Erreur lors de la récupération du fichier');
      });
};



  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    // Faites quelque chose avec la langue sélectionnée...
  };


  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setCurrentPage('categoryDetail');

    try {
      const response = await axios.get(`http://localhost:3001/api/getcours?domaine=${category.name}`);
      const filteredCourses = response.data.filter(course => course.domaine === category.name);
      setCourses(filteredCourses);
    } catch (error) {
      console.error("Erreur lors de la récupération des cours :", error);
      // Gérer les erreurs de manière appropriée
    }
  };

  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [courseComments, setCourseComments] = useState([]);
  const handleShowComments = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/${courseId}/GETcommentaires`);
      const comments = response.data.commentaires;
      setCourseComments(comments);
      setShowCommentsModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires :', error);
    }
  };


  const handleDeleteCours = async (idCours) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière après avoir supprimé ce fichier!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3001/api/cours/${idCours}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        setCourses(courses.filter(course => course._id !== idCours));
        toast.success(data.message); // Affiche un message de confirmation
      } catch (error) {
        console.error('Erreur lors de la suppression du cours:', error.message);
        toast.error('Erreur lors de la suppression du cours'); // Affiche un message d'erreur
      }
    }
  };


  const [error, setError] = useState(null);
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/getcours');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des cours');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
    setUser(JSON.parse(sessionStorage.getItem('user')));
  }, []);








  ///////////////:statistique//////////////:

  const [courseStats, setCourseStats] = useState({
    totalCourses: 0,
  });



  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/userstats');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques utilisateur');
        }
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques utilisateur:', error);
        setError(error.message);
      }
    };


    const fetchCourseStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/cours/total');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques des cours');
        }
        const data = await response.json();
        setCourseStats(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des cours:', error);
        setError(error.message);
      }
    };

    fetchUserStats();
    fetchCourseStats();
  }, []);

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    apprenants: {
      actifs: 0,
      inactifs: 0
    },
    instructeurs: {
      actifs: 0,
      inactifs: 0
    }
  });

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/userstatus');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques utilisateur');
        }
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques utilisateur:', error);
        // Gérer l'erreur, par exemple, afficher un message d'erreur à l'utilisateur
      }
    };

    fetchUserStatus();
  }, []);



 
 
  
const [loading, setLoading] = useState(false);
const [admin1, setAdmin1] = useState(null);

useEffect(() => {
  if (option === 'profile') { // Correction ici : option1 au lieu de option
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/getAdmins');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const admins = await response.json();
        console.log("Administrateurs récupérés:", admins);
        console.log("Nom de l'utilisateur connecté:", user?.name);
        
        const adminConnecte = admins.find(admin => admin.nom.trim().toLowerCase() === user?.name.trim().toLowerCase());
        console.log("Administrateur connecté:", adminConnecte);

        if (!adminConnecte) {
          throw new Error('Administrateur non trouvé');
        }
        setAdmin1(adminConnecte);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }
}, [option, user?.name]);


  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };
  return (
    <div className="accueil-container">
      <Sidebar setOption={setOption} />
      <div className="main-content">
        <Navbar className="navbar" expand="lg">
          <Container>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Link className="it" onClick={() => handleNavItemClick('home')}>
                  {t('accueil')}
                </Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link className="it" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> {t('deconnexion')}
                </Nav.Link>

                <Nav.Link className="it" >
                  <FontAwesomeIcon icon={faUser} /> {user?.name}
                </Nav.Link>
                <NavDropdown title={<><FontAwesomeIcon icon={faLanguage} /> {t('langue')} </>} className="custom-dropdown">
                  <NavDropdown.Item onClick={() => {
                    ChangeEn();
                    setLanguageDropdownVisible(false);
                  }}>
                    <b>{t('anglais')}</b>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => {
                    ChangeFr();
                    setLanguageDropdownVisible(false);
                  }}>
                    <b>{t('francais')}</b>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => {
                    ChangeAr();
                    setLanguageDropdownVisible(false);
                  }}>
                    <b>{t('arabe')}</b>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        {option === 'dashboard' && (
          <div>
            <h1 className="taille"><center>{t('Tableau de bord')}</center></h1>
            <br /><br />
            <div className="grid-container-dashboard">
              <UserStatsChart userStats={userStats} courseStats={courseStats} />
            </div>
          </div>
        )}

{option === 'profile' && (
  <>
    {loading && <CircularProgress />}
    {error && <Alert severity="error">Error: {error.message}</Alert>}
    {admin1 && (
      <Container style={{ height: '100vh' }}>
        <Card sx={{ width: 600, margin: 'auto' }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'orange', width: 100, height: 100, fontSize: 50 }}>
                {admin1.nom.charAt(0)}
              </Avatar>
            }
            title={<Typography variant="h4" sx={{ fontWeight: 'bold' }}>{`Profil de ${admin1.nom}`}</Typography>}
          />
          <CardContent>
            <Typography variant="body1"><strong>Email:</strong> {admin1.email}</Typography>
            <Typography variant="body1"><strong>Login:</strong> {admin1.login}</Typography>
            <Typography variant="body1"><strong>Langue:</strong> {admin1.langue}</Typography>
            
          </CardContent>
        </Card>
      </Container>
    )}
  </>
)}







        {option === 'users' && (
          <main className="center-content">
            <br />
            <div className="title-container">
              <h1>{t('listeUtilisateurs')}</h1>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button className='btn-add-app' onClick={() => setShowModal(true)}>
                <FontAwesomeIcon icon={faPlus} /> &nbsp;<b>{t('ajouterUtilisateur')}</b>
              </Button>
            </div>
            <br /><br /><br /><br /><br />
            <center>
              <table className="table-container">
                <thead>
                  <tr>
                    <td colSpan="4">
                      <InputGroup className="mb-3">
                        <FormControl
                          placeholder={t('rechercherUtilisateur')}
                          aria-label={t('rechercherUtilisateur')}
                          aria-describedby="basic-addon2"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </InputGroup>
                    </td>
                  </tr>
                  <tr>
                    <th>{t('nom')}</th>
                    <th>{t('email')}</th>
                    <th>{t('role')}</th>
                    <th>{t('etat')}</th>
                  </tr>
                </thead>
                <tbody>
                  {searchTerm.trim() !== '' ? (
                    searchResults.map(user => (
                      <tr key={user._id}>
                        <td>{user.nom}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <Switch
                            onChange={() => toggleUserStatus(user._id, user.etat, user.role)}
                            checked={user.etat === 'actif'}
                            onColor="#28a745"
                            offColor="#dc3545"
                            checkedIcon={<span className="switch-label"></span>}
                            uncheckedIcon={<span className="switch-label"></span>}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    users.map(user => (
                      <tr key={user._id}>
                        <td>{user.nom} </td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <Switch
                            onChange={() => toggleUserStatus(user._id, user.etat, user.role)}
                            checked={user.etat === 'actif'}
                            onColor="#28a745"
                            offColor="#dc3545"
                            checkedIcon={<span className="switch-label"></span>}
                            uncheckedIcon={<span className="switch-label"></span>}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </center>
          </main>
        )}
        {option === 'videos' && (
          <div className="container mt-5">
            <div className="title-container">
              <h1>{t('consultationVideosAudios')}</h1>
            </div>
            <br /> <br />
            <div className="table-responsive mt-4">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <td colspan="4">
                      <InputGroup className="mb-3">
                        <FormControl
                          placeholder={t('rechercherVideoAudio')}
                          aria-label={t('rechercherVideoAudio')}
                          aria-describedby="basic-addon2"
                          value={searchTerm2}
                          onChange={(e) => setSearchTerm2(e.target.value)}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={handleFichierSearch}>
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </InputGroup>
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">{t('titre')}</th>
                    <th scope="col">{t('fichier')}</th>
                    <th scope="col">{t('dateUpload')}</th>
                    <th scope="col">{t('heureUpload')}</th>
                    <th scope="col">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {searchTerm2.trim() !== '' ? (
                    searchResults2.map((fichier) => (
                      <tr key={fichier._id}>
                        <td>{fichier.title}</td>
                        <td>{fichier.fileName}</td>
                        <td>{new Date(fichier.dateUpload).toLocaleDateString()}</td>
                        <td>{new Date(fichier.dateUpload).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}</td>
                        <td>
                          <button className="btn-transcrire" onClick={() => fetchFileByName(fichier.fileName)}>
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button className="btn-supprimer" onClick={() => deleteFile(fichier.id_fichier)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    fichiers.map((fichier) => (
                      <tr key={fichier._id}>
                        <td>{fichier.title}</td>
                        <td>{fichier.fileName}</td>
                        <td>{new Date(fichier.dateUpload).toLocaleDateString()}</td>
                        <td>{new Date(fichier.dateUpload).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}</td>
                        <td>
                          <button className="btn-transcrire" onClick={() => fetchFileByName(fichier.fileName)}>
                            <FontAwesomeIcon icon={faEye} />
                          </button>&nbsp;&nbsp;
                          <button className="btn-supprimer" onClick={() => deleteFile(fichier.id_fichier)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {option === 'cours' && (
          <div>
            &nbsp;
            <h1 className="taille"><center>{t('Gestion des cours')}</center></h1>
            <br /><br />
            <center><table className="table-container">
              <thead>
                <tr>

                  <th>Titre</th>
                  <th>Prix</th>
                  <th>Langue</th>
                  <th>Domaine</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => {
                  // Find the category name for the course's domain
                  const category = categories.find(cat => cat.id === course.categoryId);
                  const domainName = category ? category.name : 'Domaine inconnu';

                  return (
                    <tr key={course._id}>

                      <td>{course.titre}</td>
                      <td>{course.prix}</td>
                      <td>{course.langue}</td>
                      <td>{course.domaine}</td>
                      <td>
                        <button className="btn-transcrire" onClick={() => handleViewFile(course.fichier)}><FontAwesomeIcon icon={faEye} /></button>
                        &nbsp;&nbsp;<button className="btn-delete" onClick={() => handleDeleteCours(course._id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <br />
                         <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // Empêcher le comportement de lien par défaut
                            handleShowComments(course._id);
                            setShowCommentsModal(true);
                          }}
                        >
                          Voir les commentaires
                        </a> 
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </center>
          </div>
        )}

        <Modal show={showCommentsModal} onHide={() => setShowCommentsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Commentaires du cours</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {courseComments.map((comment, index) => (
              <div key={index}>
                <p><b>Apprenant :</b> {comment.apprenant ? comment.apprenant.nom : 'Nom inconnu'}</p>
                <p>{comment.commentaire}</p>
              </div>
            ))}
          </Modal.Body>
        </Modal>




        {option === 'quiz' && (
          <div>
            <h1 className="taille"><center>{t('quiz')}</center></h1>
            <br /><br /><br /><br />
            <div className="grid-container">
              {quizzes?.map((quiz, index) => (
                <div className="grid-item" key={quiz._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div onClick={() => handleOpenModal(quiz)} style={{ cursor: 'pointer' }}>
                      <p className='tit'>{quiz.titre}</p>
                    </div>
                    <button className="btn-delete" onClick={() => handleDeleteQuiz(quiz._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedQuiz && selectedQuiz.questions && (
              <Modal show={true} onHide={() => setSelectedQuiz(null)}>
                <Modal.Header closeButton>
                  <Modal.Title>{selectedQuiz.titre}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-scrollable">
                  <form>
                    {selectedQuiz.questions.map((question, index) => (
                      <div key={index}>
                        <p><b>Question {index + 1}:</b></p>
                        <p>{question.text}</p>
                        <ul>
                          {question.suggestions.map((suggestion, optionIndex) => (
                            <li key={optionIndex}>
                              {suggestion} {suggestion === question.correctAnswer && "(Correct)"}
                            </li>
                          ))}
                        </ul>
                        <br /><br />
                      </div>
                    ))}
                  </form>
                </Modal.Body>

              </Modal>
            )}
          </div>
        )}









        <Modal show={showModal} onHide={() => setShowModal(false)} className='modal'>
          <Modal.Header closeButton>
            <Modal.Title>{t('ajouterUtilisateur')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <Form>
                  {/* Première partie - Gauche */}
                  <Form.Group controlId="formBasicRole">
                    <Form.Label>{t('role')}</Form.Label>
                    <Form.Control as="select" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })} className="form-control">
                      <option value="">{t('selectionnezRole')}</option>
                      <option value="apprenant">{t('apprenant')}</option>
                      <option value="instructeur">{t('instructeur')}</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formBasicNom">
                    <Form.Label>{t('nom')}</Form.Label>
                    <Form.Control type="text" placeholder={t('entrezNom')} value={userData.nom} onChange={(e) => setUserData({ ...userData, nom: e.target.value })} className="form-control" />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control type="email" placeholder={t('entrezEmail')} value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} className="form-control" />
                  </Form.Group>
                  <Form.Group controlId="formBasicLangue">
                    <Form.Label>{t('langue')}</Form.Label>
                    <Form.Control as="select" value={userData.langue} onChange={(e) => setUserData({ ...userData, langue: e.target.value })} className="form-control">
                      <option value="">{t('selectionnezLangue')}</option>
                      <option value="français">{t('francais')}</option>
                      <option value="anglais">{t('anglais')}</option>
                      <option value="arabe">{t('arabe')}</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formBasicMdp">
                    <Form.Label>{t('motDePasse')}</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('entrezMotDePasse')}
                        value={userData.mdp}
                        onChange={(e) => setUserData({ ...userData, mdp: e.target.value })}
                        className="form-control"
                      />
                      <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer', borderLeft: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Form>
              </Col>
              <Col>
                <Form>
                  {/* Deuxième partie - Droite */}
                  {userData.role === 'apprenant' && (
                    <>
                      <Form.Group controlId="formBasicDateNaiss">
                        <Form.Label>{t('dateNaissance')}</Form.Label>
                        <Form.Control type="date" value={userData.dateNaiss} onChange={(e) => setUserData({ ...userData, dateNaiss: e.target.value })} className="form-control" />
                      </Form.Group>
                      <Form.Group controlId="formBasicStatut">
                        <Form.Label>{t('statut')}</Form.Label>
                        <Form.Control as="select" value={userData.statut} onChange={(e) => setUserData({ ...userData, statut: e.target.value })} className="form-control">
                          <option value="">{t('selectionnezStatut')}</option>
                          <option value="Ingénieur">{t('ingenieur')}</option>
                          <option value="Développeur">{t('developpeur')}</option>
                          <option value="Etudiant">{t('etudiant')}</option>
                          <option value="Autre">{t('autre')}</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formBasicNiveau">
                        <Form.Label>{t('niveau')}</Form.Label>
                        <Form.Control as="select" value={userData.niveau} onChange={(e) => setUserData({ ...userData, niveau: e.target.value })} className="form-control">
                          <option value="">{t('selectionnezNiveau')}</option>
                          <option value="débutant">{t('debutant')}</option>
                          <option value="intermédiaire">{t('intermediaire')}</option>
                          <option value="avancé">{t('avance')}</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formBasicVille">
                        <Form.Label>{t('ville')}</Form.Label>
                        <Form.Control type="text" placeholder={t('entrezVille')} value={userData.ville} onChange={(e) => setUserData({ ...userData, ville: e.target.value })} className="form-control" />
                      </Form.Group>
                    </>
                  )}
                  {userData.role === 'instructeur' && (
                    <>
                      <Form.Group controlId="formBasicPoste">
                        <Form.Label>{t('poste')}</Form.Label>
                        <Form.Control as="select" value={userData.poste} onChange={(e) => setUserData({ ...userData, poste: e.target.value })} className="form-control">
                          <option value="">{t('selectionnezPoste')}</option>
                          <option value="enseignant">{t('enseignant')}</option>
                          <option value="formateur professionnel">{t('formateurProfessionnel')}</option>
                          <option value="ingénieur">{t('ingenieur')}</option>
                          <option value="autre">{t('autre')}</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formBasicEtablissement">
                        <Form.Label>{t('etablissement')}</Form.Label>
                        <Form.Control type="text" placeholder={t('entrezEtablissement')} value={userData.etablissement} onChange={(e) => setUserData({ ...userData, etablissement: e.target.value })} className="form-control" />
                      </Form.Group>
                      <Form.Group controlId="formBasicSpecialite">
                        <Form.Label>{t('specialite')}</Form.Label>
                        <Form.Control type="text" placeholder={t('entrezSpecialite')} value={userData.specialite} onChange={(e) => setUserData({ ...userData, specialite: e.target.value })} className="form-control" />
                      </Form.Group>
                      <Form.Group controlId="formBasicNiveauInstr">
                        <Form.Label>{t('niveau')}</Form.Label>
                        <Form.Control as="select" value={userData.niveau} onChange={(e) => setUserData({ ...userData, niveau: e.target.value })} className="form-control">
                          <option value="">{t('selectionnezNiveau')}</option>
                          <option value="débutant">{t('debutant')}</option>
                          <option value="intermédiaire">{t('intermediaire')}</option>
                          <option value="avancé">{t('avance')}</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formBasicTel">
                        <Form.Label>{t('telephone')}</Form.Label>
                        <Form.Control type="text" placeholder={t('entrezTelephone')} value={userData.tel} onChange={(e) => setUserData({ ...userData, tel: e.target.value })} className="form-control" />
                      </Form.Group>
                    </>
                  )}
                </Form>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btnn" variant="primary" onClick={handleAddUser}>{t('ajouter')}</Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
};
export default AdminComponent;