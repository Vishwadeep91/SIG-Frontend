import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tooltip,
    CircularProgress,
    Alert,
    Stack,
    Rating,
    LinearProgress,
    MenuItem,
    useTheme,
    useMediaQuery,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Select,
    InputAdornment,
    Fade,
    Tabs,
    Tab,
    Autocomplete,
    Badge,
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator } from '@mui/lab';
import {
    Person,
    Work,
    School,
    Timeline as TimelineIcon,
    Code,
    Business,
    Assignment,
    Edit,
    Add,
    Close,
    OpenInNew,
    VerifiedUser,
    Star,
    Group,
    TrendingUp,
    Assessment,
    PieChart,
    BarChart,
    Radar,
    ExpandMore,
    Search,
    FilterList,
    Sort,
    Visibility,
    CompareArrows,
    AccountCircle,
    Email,
    Phone,
    LocationOn,
    CalendarToday,
    LocalHospital,
    AdminPanelSettings,
    Weekend,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { Bar, Pie, Radar as RadarChart } from 'react-chartjs-2';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    AnimatedBackground,
    StyledCard,
    DetailRow,
    StyledAvatar,
    ProgressBar,
    SkillChip,
    GradientBorderCard,
    TimelineContainer,
    ExperienceCard,
    TechChip,
    StyledAccordion,
    StyledAccordionSummary,
    AnimatedAddButton,
    StyledTextField,
    ChartContainer,
    SkillsGrid,
    PageContainer,
    AnimatedSection,
    ProfileSection,
    SectionTitle,
    DetailModal,
    DetailSection,
    StatusChip,
    InfoCard,
    AdminSection,
    StyledTableContainer,
    FilterBar,
    CustomTimeline,
    CustomTimelineItem,
    CustomTimelineDot,
    CustomTimelineContent,
    ProjectCard,
    StyledChip
} from './styled';
import LoadingScreen from './LoadingScreen';
// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler
);

const SkillPath = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [allEmployees, setAllEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        skills: [],
        experience: '',
        bloodGroup: '',
        certifications: [],
        previousCompanies: [],
        previousProjects: [],
    });
    const [submitting, setSubmitting] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterTeam, setFilterTeam] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('profile');
    const [loadingEmployee, setLoadingEmployee] = useState(false);
    const [employeeError, setEmployeeError] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [certModalOpen, setCertModalOpen] = useState(false);

    const token = localStorage.getItem('token');
    const isAdmin = JSON.parse(localStorage.getItem('userData'))?.isAdmin;

    useEffect(() => {
        try {
            fetchData();
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setTimeout(() => {
                setInitialLoading(false);
            }, 500);
        }
    }, []); 

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch employee profile with updated response format
            const profileResponse = await axios.get(`${BaseUrl}/employees/profile`, { headers });
            
            // Update employeeData with the employee object from response
            setEmployeeData(profileResponse.data.employee);

            // If admin, fetch all employees
            if (isAdmin) {
                const allEmployeesResponse = await axios.get(`${BaseUrl}/employees`, { headers });
                // Ensure all array fields are initialized even if null
                const processedEmployees = allEmployeesResponse.data.map(emp => ({
                    ...emp,
                    skills: emp.skills || [],
                    previousCompanies: emp.previousCompanies || [],
                    previousProjects: emp.previousProjects || [],
                    certifications: emp.certifications || []
                }));
                setAllEmployees(processedEmployees);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        try {
            setSubmitting(true);

            // Debug logging
            // console.log('BaseUrl:', BaseUrl);
            // console.log('Employee ID:', employeeData._id);
            // console.log('Update URL:', `${BaseUrl}/employee/update-professional/${employeeData._id}`);

            const response = await axios.put(
                `${BaseUrl}/employees/update-professional/${employeeData._id}`,  // Updated endpoint
                {
                    skills: editForm.skills,
                    experience: editForm.experience,
                    bloodGroup: editForm.bloodGroup,
                    previousCompanies: editForm.previousCompanies,
                    previousProjects: editForm.previousProjects,
                    certifications: editForm.certifications
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // console.log('Server Response:', response.data); // Debug logging

            if (response.data && response.data.employee) {
                setEmployeeData(response.data.employee);
                setEditModalOpen(false);
                toast.success('Profile updated successfully');
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url
            });
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Chart data preparation for admin view
    const prepareChartData = () => {
        if (!isAdmin || !allEmployees.length) return null;

        // Skills distribution
        const skillsData = {
            labels: ['Advanced', 'Intermediate', 'Beginner'],
            datasets: [{
                data: [
                    allEmployees.reduce((acc, emp) => acc + emp.skills.filter(s => s.level === 'Advanced').length, 0),
                    allEmployees.reduce((acc, emp) => acc + emp.skills.filter(s => s.level === 'Intermediate').length, 0),
                    allEmployees.reduce((acc, emp) => acc + emp.skills.filter(s => s.level === 'Beginner').length, 0),
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
            }],
        };

        // Team distribution
        const teamData = {
            labels: [...new Set(allEmployees.map(emp => emp.team))],
            datasets: [{
                label: 'Team Distribution',
                data: [...new Set(allEmployees.map(emp => emp.team))].map(team =>
                    allEmployees.filter(emp => emp.team === team).length
                ),
                backgroundColor: 'rgba(49, 17, 136, 0.6)',
            }],
        };

        return { skillsData, teamData };
    };

    // Filter and sort employees
    const filteredEmployees = useMemo(() => {
        return allEmployees
            .filter(emp => {
                const matchesTeam = filterTeam === 'all' || emp.team === filterTeam;
                const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.role.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesTeam && matchesSearch;
            })
            .sort((a, b) => {
                const order = sortOrder === 'asc' ? 1 : -1;
                switch (sortBy) {
                    case 'name':
                        return order * a.name.localeCompare(b.name);
                    case 'role':
                        return order * a.role.localeCompare(b.role);
                    case 'experience':
                        return order * (parseInt(a.experience) - parseInt(b.experience));
                    default:
                        return 0;
                }
            });
    }, [allEmployees, filterTeam, searchQuery, sortBy, sortOrder]);

    const handleViewEmployee = async (employee) => {
        try {
            setLoadingEmployee(true);
            setEmployeeError(null);
            const token = localStorage.getItem('token');

            // Since we already have all the employee data, we can just set it directly
            setSelectedEmployee(employee);
            setDetailModalOpen(true);
        } catch (error) {
            console.error('Error fetching employee details:', error);
            setEmployeeError(error.response?.data?.message || 'Failed to fetch employee details');
            toast.error('Failed to fetch employee details');
        } finally {
            setLoadingEmployee(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            }}>
                <CircularProgress sx={{ color: '#311188' }} />
            </Box>
        );
    }

    const chartData = prepareChartData();

    return (
        <PageContainer>
            <Container maxWidth="xl">
                {isAdmin && (
                    <AdminSection>
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Typography variant="h4" fontWeight="600" color="primary">
                                Team Management
                            </Typography>
                            <Tabs
                                value={viewMode}
                                onChange={(e, newValue) => setViewMode(newValue)}
                                sx={{
                                    '& .MuiTab-root': {
                                        minWidth: 100,
                                        fontWeight: 500,
                                    },
                                }}
                            >
                                <Tab value="profile" label="My Profile" />
                                <Tab value="team" label="Team View" />
                            </Tabs>
                        </Box>

                        {viewMode === 'team' && (
                            <>
                                <FilterBar>
                                    <TextField
                                        placeholder="Search employees..."
                                        variant="outlined"
                                        size="small"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        sx={{ minWidth: 200 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Select
                                        value={filterTeam}
                                        onChange={(e) => setFilterTeam(e.target.value)}
                                        size="small"
                                        startAdornment={<FilterList sx={{ mr: 1 }} />}
                                    >
                                        <MenuItem value="all">All Teams</MenuItem>
                                        {[...new Set(allEmployees.map(emp => emp.team))].map(team => (
                                            <MenuItem key={team} value={team}>{team}</MenuItem>
                                        ))}
                                    </Select>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        size="small"
                                        startAdornment={<Sort sx={{ mr: 1 }} />}
                                    >
                                        <MenuItem value="name">Name</MenuItem>
                                        <MenuItem value="role">Role</MenuItem>
                                        <MenuItem value="experience">Experience</MenuItem>
                                    </Select>
                                    <IconButton onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                                        <CompareArrows sx={{ transform: sortOrder === 'desc' ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
                                    </IconButton>
                                </FilterBar>

                                <StyledTableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Employee</TableCell>
                                                <TableCell>Role</TableCell>
                                                <TableCell>Team</TableCell>
                                                <TableCell>Experience</TableCell>
                                                <TableCell>Skills</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredEmployees
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((employee) => (
                                                    <TableRow key={employee._id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar src={employee.profileImage}>
                                                                    {employee.name.charAt(0)}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="subtitle2" fontWeight="600">
                                                                        {employee.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {employee.employeeId}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography>{employee.role}</Typography>
                                                                {employee.isTeamLead && (
                                                                    <Chip
                                                                        label="Team Lead"
                                                                        size="small"
                                                                        color="primary"
                                                                        sx={{ ml: 1 }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{employee.team}</TableCell>
                                                        <TableCell>{employee.experience}</TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                {employee.skills.slice(0, 3).map((skill, index) => (
                                                                    <StyledChip
                                                                        key={index}
                                                                        label={skill.name}
                                                                        size="small"
                                                                    />
                                                                ))}
                                                                {employee.skills.length > 3 && (
                                                                    <Chip
                                                                        label={`+${employee.skills.length - 3}`}
                                                                        size="small"
                                                                        sx={{ background: 'rgba(49, 17, 136, 0.05)' }}
                                                                    />
                                                                )}
                                                                {employee.skills.length === 0 && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        No skills added
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                                <Tooltip title="View Details">
                                                                    <IconButton onClick={() => handleViewEmployee(employee)}>
                                                                        <Visibility />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {employee.currentProject && (
                                                                    <Tooltip title={`Current Project: ${employee.currentProject.title}`}>
                                                                        <Chip
                                                                            label={employee.currentProject.title}
                                                                            size="small"
                                                                            color="success"
                                                                            variant="outlined"
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        component="div"
                                        count={filteredEmployees.length}
                                        page={page}
                                        onPageChange={(e, newPage) => setPage(newPage)}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={(e) => {
                                            setRowsPerPage(parseInt(e.target.value, 10));
                                            setPage(0);
                                        }}
                                    />
                                </StyledTableContainer>
                            </>
                        )}
                    </AdminSection>
                )}

                {(!isAdmin || viewMode === 'profile') && (
                    <AnimatedSection
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <ProfileSection>
                            <Box sx={{
                                display: 'flex',
                                gap: 4,
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <StyledAvatar
                                    src={employeeData?.profileImage}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: '4px solid rgba(255,255,255,0.2)'
                                    }}
                                >
                                    {employeeData?.name?.charAt(0)}
                                </StyledAvatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h3" gutterBottom fontWeight="bold">
                                        {employeeData?.name || 'Loading...'}
                                    </Typography>
                                    <Typography variant="h5" sx={{ opacity: 0.9 }}>
                                        {employeeData?.role} • {employeeData?.team}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={employeeData?.employeeId}
                                            icon={<Person />}
                                            sx={{ background: 'rgba(255,255,255,0.1)' }}
                                        />
                                        <Chip
                                            label={employeeData?.status}
                                            icon={<Work />}
                                            sx={{ background: 'rgba(255,255,255,0.1)' }}
                                        />
                                        {employeeData?.bloodGroup && (
                                            <Chip
                                                label={`Blood Group: ${employeeData.bloodGroup}`}
                                                icon={<LocalHospital />}
                                                sx={{ background: 'rgba(255,255,255,0.1)' }}
                                            />
                                        )}
                                        {employeeData?.isTeamLead && (
                                            <Chip
                                                label="Team Lead"
                                                icon={<Group />}
                                                sx={{ background: 'rgba(255,255,255,0.1)' }}
                                            />
                                        )}
                                        {employeeData?.isAdmin && (
                                            <Chip
                                                label="Admin"
                                                icon={<AdminPanelSettings />}
                                                sx={{ background: 'rgba(255,255,255,0.1)' }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<Edit />}
                                    onClick={() => {
                                        setEditForm({
                                            skills: employeeData?.skills || [],
                                            experience: employeeData?.experience || '',
                                            bloodGroup: employeeData?.bloodGroup || '',
                                            previousCompanies: employeeData?.previousCompanies || [],
                                            previousProjects: employeeData?.previousProjects || [],
                                            certifications: employeeData?.certifications || []
                                        });
                                        setEditModalOpen(true);
                                    }}
                                    sx={{
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '12px',
                                        zIndex: 1000,
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.2)',
                                        }
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            </Box>
                        </ProfileSection>

                        {/* Skills Section */}
                        <Box sx={{ mt: 8 }}>
                            <SectionTitle variant="h4">
                                Skills & Expertise
                            </SectionTitle>
                            <SkillsGrid>
                                {employeeData?.skills?.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Box>
                                            <Typography variant="h6" gutterBottom color="primary" fontWeight="600">
                                                {skill.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{
                                                    flex: 1,

                                                }}>
                                                    <ProgressBar
                                                        variant="determinate"
                                                        value={skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 60 : 30}
                                                    />
                                                </Box>
                                                <Typography variant="body2" color="primary" fontWeight="500">
                                                    {skill.level}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                ))}
                            </SkillsGrid>
                        </Box>

                        {/* Professional Journey Section */}
                        <Box sx={{ mt: 12 }}>
                            <SectionTitle variant="h4">
                                Professional Journey
                            </SectionTitle>
                            <Box sx={{ position: 'relative', mt: 8 }}>
                                {/* Background decorative elements */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: -100,
                                    right: -100,
                                    width: 200,
                                    height: 200,
                                    background: 'radial-gradient(circle, rgba(49, 17, 136, 0.03) 0%, rgba(49, 17, 136, 0) 70%)',
                                    borderRadius: '50%',
                                    zIndex: 0,
                                }} />
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -100,
                                    left: -100,
                                    width: 200,
                                    height: 200,
                                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.03) 0%, rgba(34, 197, 94, 0) 70%)',
                                    borderRadius: '50%',
                                    zIndex: 0,
                                }} />

                                <CustomTimeline>
                                    {employeeData?.previousCompanies?.map((company, index) => (
                                        <CustomTimelineItem key={index} index={index}>
                                            <CustomTimelineDot />
                                            <CustomTimelineContent>
                                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                                    <Typography variant="h6" fontWeight="600" color="primary" gutterBottom>
                                                        {company.companyName}
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        fontWeight: 500
                                                    }}>
                                                        <Work sx={{ fontSize: 20, opacity: 0.7 }} />
                                                        {company.role}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5
                                                        }}>
                                                            <CalendarToday sx={{ fontSize: 16 }} />
                                                            {format(new Date(company.startDate), 'MMM yyyy')} - {format(new Date(company.endDate), 'MMM yyyy')}
                                                        </Typography>
                                                        {company.location && (
                                                            <Typography variant="body2" color="text.secondary" sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5
                                                            }}>
                                                                <LocationOn sx={{ fontSize: 16 }} />
                                                                {company.location}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    {company.technologiesUsed?.length > 0 && (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                                            {company.technologiesUsed.map((tech, idx) => (
                                                                <StyledChip
                                                                    key={idx}
                                                                    label={tech}
                                                                    size="small"
                                                                    sx={{
                                                                        background: 'rgba(49, 17, 136, 0.05)',
                                                                        '&:hover': {
                                                                            background: 'rgba(49, 17, 136, 0.1)',
                                                                        }
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    )}
                                                </Box>
                                            </CustomTimelineContent>
                                        </CustomTimelineItem>
                                    ))}
                                </CustomTimeline>
                            </Box>
                        </Box>

                        {/* Projects Section */}
                        <Box sx={{ mt: 12 }}>
                            <SectionTitle variant="h4">
                                Project Experience
                            </SectionTitle>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: 4,
                            }}>
                                {employeeData?.previousProjects?.map((project, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <ProjectCard>
                                            <Typography variant="h6" gutterBottom color="primary" fontWeight="600">
                                                {project.projectName}
                                            </Typography>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="500">
                                                {project.client}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 2, color: 'text.primary' }}>
                                                {project.description}
                                            </Typography>
                                            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {project.technologiesUsed?.map((tech, i) => (
                                                    <StyledChip
                                                        key={i}
                                                        label={tech}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        </ProjectCard>
                                    </motion.div>
                                ))}
                            </Box>
                        </Box>

                        {/* Certifications Section */}
                        <Box sx={{ mt: 12 }}>
                            <SectionTitle variant="h4">
                                Certifications & Achievements
                            </SectionTitle>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    md: 'repeat(auto-fill, minmax(320px, 1fr))',
                                    lg: 'repeat(auto-fill, minmax(350px, 1fr))'
                                },
                                gap: { xs: 2, sm: 3, md: 4 },
                                mt: 4,
                                px: { xs: 2, sm: 0 }
                            }}>
                                {employeeData?.certifications?.map((cert, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                background: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform: 'translateY(-10px)',
                                                    boxShadow: '0 20px 40px rgba(49, 17, 136, 0.2)',
                                                    '& .cert-overlay': {
                                                        opacity: 1
                                                    },
                                                    '& .view-button': {
                                                        opacity: 1,
                                                        transform: 'translateY(0)'
                                                    }
                                                }
                                            }}
                                            onClick={() => {
                                                setSelectedCertificate(cert);
                                                setCertModalOpen(true);
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '5px',
                                                    background: 'linear-gradient(90deg, #311188, #22c55e)'
                                                }}
                                            />
                                            <Box sx={{ p: 3 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    mb: 2
                                                }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: 'primary.main',
                                                            width: { xs: 40, sm: 48 },
                                                            height: { xs: 40, sm: 48 },
                                                            boxShadow: '0 4px 12px rgba(49, 17, 136, 0.2)'
                                                        }}
                                                    >
                                                        <School />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: 'primary.main',
                                                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                                                lineHeight: 1.2
                                                            }}
                                                        >
                                                            {cert.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                                                mt: 0.5
                                                            }}
                                                        >
                                                            {cert.issuer}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mb: 2
                                                    }}
                                                >
                                                    <CalendarToday sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {format(new Date(cert.issueDate), 'MMM yyyy')}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    className="view-button"
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<OpenInNew />}
                                                    sx={{
                                                        mt: 2,
                                                        background: 'linear-gradient(135deg, #311188, #22c55e)',
                                                        color: 'white',
                                                        borderRadius: '10px',
                                                        textTransform: 'none',
                                                        opacity: 0.9,
                                                        transform: 'translateY(5px)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #22c55e, #311188)',
                                                            opacity: 1
                                                        }
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </Box>
                                            <Box
                                                className="cert-overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.1), rgba(34, 197, 94, 0.1))',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                }}
                                            />
                                        </Box>
                                    </motion.div>
                                ))}
                            </Box>
                        </Box>
                    </AnimatedSection>
                )}
            </Container>

            {/* Edit Profile Modal with enhanced styling */}
            <Dialog
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        [theme.breakpoints.down('sm')]: {
                            margin: '16px',
                            width: 'calc(100% - 32px)',
                            maxHeight: 'calc(100% - 32px)',
                        },
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                    color: 'white',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Edit Professional Details</Typography>
                        <IconButton
                            onClick={() => setEditModalOpen(false)}
                            sx={{ color: 'white' }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        {/* Skills Section */}
                        <StyledAccordion defaultExpanded>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Skills
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                {editForm.skills.map((skill, index) => (
                                    <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Skill Name"
                                            value={skill.name}
                                            onChange={(e) => {
                                                const newSkills = [...editForm.skills];
                                                newSkills[index].name = e.target.value;
                                                setEditForm({ ...editForm, skills: newSkills });
                                            }}
                                            sx={{ flex: 1, minWidth: { xs: '100%', sm: 0 } }}
                                        />
                                        <StyledTextField
                                            select
                                            label="Level"
                                            value={skill.level}
                                            onChange={(e) => {
                                                const newSkills = [...editForm.skills];
                                                newSkills[index].level = e.target.value;
                                                setEditForm({ ...editForm, skills: newSkills });
                                            }}
                                            sx={{ width: { xs: '100%', sm: 200 } }}
                                        >
                                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                                <MenuItem key={level} value={level}>
                                                    {level}
                                                </MenuItem>
                                            ))}
                                        </StyledTextField>
                                        <IconButton
                                            onClick={() => {
                                                const newSkills = editForm.skills.filter((_, i) => i !== index);
                                                setEditForm({ ...editForm, skills: newSkills });
                                            }}
                                            sx={{
                                                alignSelf: 'center',
                                                color: theme.palette.error.main,
                                                '&:hover': {
                                                    background: theme.palette.error.light,
                                                },
                                            }}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Box>
                                ))}
                                <AnimatedAddButton
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setEditForm({
                                            ...editForm,
                                            skills: [...editForm.skills, { name: '', level: 'Beginner', endorsedBy: [] }]
                                        });
                                    }}
                                >
                                    Add Skill
                                </AnimatedAddButton>
                            </AccordionDetails>
                        </StyledAccordion>

                        {/* Certifications Section */}
                        <StyledAccordion>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Certifications
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                {editForm.certifications.map((cert, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.5)' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Certification Name"
                                                    value={cert.name || ''}
                                                    onChange={(e) => {
                                                        const newCerts = [...editForm.certifications];
                                                        newCerts[index] = {
                                                            ...newCerts[index],
                                                            name: e.target.value
                                                        };
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Issuer"
                                                    value={cert.issuer || ''}
                                                    onChange={(e) => {
                                                        const newCerts = [...editForm.certifications];
                                                        newCerts[index] = {
                                                            ...newCerts[index],
                                                            issuer: e.target.value
                                                        };
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="Issue Date"
                                                    value={cert.issueDate ? new Date(cert.issueDate) : null}
                                                    onChange={(newDate) => {
                                                        const newCerts = [...editForm.certifications];
                                                        newCerts[index] = {
                                                            ...newCerts[index],
                                                            issueDate: newDate?.toISOString()
                                                        };
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Certificate URL"
                                                    value={cert.certificateUrl || ''}
                                                    onChange={(e) => {
                                                        const newCerts = [...editForm.certifications];
                                                        newCerts[index] = {
                                                            ...newCerts[index],
                                                            certificateUrl: e.target.value
                                                        };
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <IconButton
                                                    onClick={() => {
                                                        const newCerts = editForm.certifications.filter((_, i) => i !== index);
                                                        setEditForm({ ...editForm, certifications: newCerts });
                                                    }}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <Button
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setEditForm({
                                            ...editForm,
                                            certifications: [...editForm.certifications, {
                                                name: '',
                                                issuer: '',
                                                issueDate: new Date().toISOString(),
                                                certificateUrl: ''
                                            }]
                                        });
                                    }}
                                    sx={{
                                        mt: 2,
                                        background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.1), rgba(34, 197, 94, 0.1))',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.2), rgba(34, 197, 94, 0.2))',
                                        }
                                    }}
                                >
                                    Add Certification
                                </Button>
                            </AccordionDetails>
                        </StyledAccordion>

                        {/* Work Experience Section */}
                        <StyledAccordion>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Work Experience
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                {editForm.previousCompanies.map((company, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.5)' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Company Name"
                                                    value={company.companyName}
                                                    onChange={(e) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].companyName = e.target.value;
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Role"
                                                    value={company.role}
                                                    onChange={(e) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].role = e.target.value;
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={company.startDate ? new Date(company.startDate) : null}
                                                    onChange={(newDate) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].startDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={company.endDate ? new Date(company.endDate) : null}
                                                    onChange={(newDate) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].endDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Location"
                                                    value={company.location}
                                                    onChange={(e) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].location = e.target.value;
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    label="Technologies Used"
                                                    value={company.technologiesUsed?.join(', ')}
                                                    onChange={(e) => {
                                                        const newCompanies = [...editForm.previousCompanies];
                                                        newCompanies[index].technologiesUsed = e.target.value.split(',').map(t => t.trim());
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                    helperText="Enter technologies separated by commas"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <IconButton
                                                    onClick={() => {
                                                        const newCompanies = editForm.previousCompanies.filter((_, i) => i !== index);
                                                        setEditForm({ ...editForm, previousCompanies: newCompanies });
                                                    }}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <AnimatedAddButton
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setEditForm({
                                            ...editForm,
                                            previousCompanies: [...editForm.previousCompanies, {
                                                companyName: '',
                                                role: '',
                                                startDate: new Date().toISOString(),
                                                endDate: new Date().toISOString(),
                                                location: '',
                                                technologiesUsed: []
                                            }]
                                        });
                                    }}
                                >
                                    Add Work Experience
                                </AnimatedAddButton>
                            </AccordionDetails>
                        </StyledAccordion>

                        {/* Project Experience Section */}
                        <StyledAccordion>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Project Experience
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                {editForm.previousProjects.map((project, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.5)' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Project Name"
                                                    value={project.projectName}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].projectName = e.target.value;
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Client"
                                                    value={project.client}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].client = e.target.value;
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label="Description"
                                                    value={project.description}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].description = e.target.value;
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={project.startDate ? new Date(project.startDate) : null}
                                                    onChange={(newDate) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].startDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={project.endDate ? new Date(project.endDate) : null}
                                                    onChange={(newDate) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].endDate = newDate?.toISOString();
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    renderInput={(params) => <StyledTextField {...params} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Team Size"
                                                    type="number"
                                                    value={project.teamSize}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].teamSize = parseInt(e.target.value);
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Project URL"
                                                    value={project.projectUrl}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].projectUrl = e.target.value;
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    label="Technologies Used"
                                                    value={project.technologiesUsed?.join(', ')}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].technologiesUsed = e.target.value.split(',').map(t => t.trim());
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    helperText="Enter technologies separated by commas"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StyledTextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    label="Responsibilities"
                                                    value={project.responsibilities?.join(', ')}
                                                    onChange={(e) => {
                                                        const newProjects = [...editForm.previousProjects];
                                                        newProjects[index].responsibilities = e.target.value.split(',').map(r => r.trim());
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    helperText="Enter responsibilities separated by commas"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <IconButton
                                                    onClick={() => {
                                                        const newProjects = editForm.previousProjects.filter((_, i) => i !== index);
                                                        setEditForm({ ...editForm, previousProjects: newProjects });
                                                    }}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                                <AnimatedAddButton
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setEditForm({
                                            ...editForm,
                                            previousProjects: [...editForm.previousProjects, {
                                                projectName: '',
                                                client: '',
                                                description: '',
                                                startDate: new Date().toISOString(),
                                                endDate: new Date().toISOString(),
                                                teamSize: 1,
                                                projectUrl: '',
                                                technologiesUsed: [],
                                                responsibilities: []
                                            }]
                                        });
                                    }}
                                >
                                    Add Project
                                </AnimatedAddButton>
                            </AccordionDetails>
                        </StyledAccordion>

                        {/* Basic Information */}
                        <StyledAccordion>
                            <StyledAccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#311188' }}>
                                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Basic Information
                                </Typography>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            fullWidth
                                            label="Experience"
                                            value={editForm.experience}
                                            onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            fullWidth
                                            label="Blood Group"
                                            value={editForm.bloodGroup}
                                            onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </StyledAccordion>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setEditModalOpen(false)}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        onClick={handleEditSubmit}
                        loading={submitting}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                            color: 'white',
                        }}
                    >
                        Save Changes
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            {/* Employee Detail Modal */}
            <DetailModal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                {loadingEmployee ? (
                    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress sx={{ color: '#311188' }} />
                    </Box>
                ) : employeeError ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="error">{employeeError}</Typography>
                        <Button
                            onClick={() => setDetailModalOpen(false)}
                            variant="outlined"
                            sx={{ mt: 2 }}
                        >
                            Close
                        </Button>
                    </Box>
                ) : selectedEmployee && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <StyledAvatar
                                        src={selectedEmployee.profileImage}
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            border: '3px solid rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        {selectedEmployee.name?.charAt(0)}
                                    </StyledAvatar>
                                    <Box>
                                        <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 600 }}>
                                            {selectedEmployee.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                                {selectedEmployee.role} • {selectedEmployee.team}
                                            </Typography>
                                            <StatusChip
                                                label={selectedEmployee.status}
                                                status={selectedEmployee.status}
                                                size="small"
                                            />
                                            {selectedEmployee.isTeamLead && (
                                                <Chip
                                                    label="Team Lead"
                                                    size="small"
                                                    color="primary"
                                                    icon={<Group />}
                                                />
                                            )}
                                            {selectedEmployee.isAdmin && (
                                                <Chip
                                                    label="Admin"
                                                    size="small"
                                                    color="secondary"
                                                    icon={<AdminPanelSettings />}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                                <IconButton
                                    onClick={() => setDetailModalOpen(false)}
                                    sx={{ color: 'white' }}
                                >
                                    <Close />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <DetailSection>
                                <div className="detail-grid">
                                    {/* Contact Information */}
                                    <motion.div
                                        className="detail-item"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="flex justify-start items-center gap-2">
                                            <div className="detail-icon">
                                                <AccountCircle />
                                            </div>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Contact Details
                                            </Typography>
                                        </div>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Email fontSize="small" color="primary" />
                                                <Typography>{selectedEmployee.email}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Business fontSize="small" color="primary" />
                                                <Typography>{selectedEmployee.team}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Badge fontSize="small" color="primary" />
                                                <Typography>{selectedEmployee.employeeId}</Typography>
                                            </Box>
                                            {selectedEmployee.bloodGroup && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocalHospital fontSize="small" color="primary" />
                                                    <Typography>{selectedEmployee.bloodGroup}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </motion.div>

                                    {/* Role & Experience */}
                                    <motion.div
                                        className="detail-item"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="flex justify-start items-center gap-2">
                                            <div className="detail-icon">
                                                <Work />
                                            </div>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                Professional Info
                                            </Typography>
                                        </div>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Experience
                                                </Typography>
                                                <Typography variant="h6">
                                                    {selectedEmployee.experience || '0 years'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Current Project
                                                </Typography>
                                                <Typography variant="h6">
                                                    {selectedEmployee.currentProject?.title || 'Not Assigned'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {selectedEmployee.isTeamLead && (
                                                    <Chip
                                                        icon={<Group />}
                                                        label="Team Lead"
                                                        color="primary"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                                {selectedEmployee.isAdmin && (
                                                    <Chip
                                                        icon={<AdminPanelSettings />}
                                                        label="Admin"
                                                        color="success"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                                {selectedEmployee.isOnBench && (
                                                    <Chip
                                                        icon={<Weekend />}
                                                        label="On Bench"
                                                        color="warning"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </motion.div>

                                    {/* Skills Section */}
                                    {selectedEmployee.skills?.length > 0 && (
                                        <motion.div
                                            className="detail-item"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            style={{ gridColumn: '1 / -1' }}
                                        >
                                            <div className="flex justify-start items-center gap-2">
                                                <div className="detail-icon">
                                                    <Code />
                                                </div>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Skills & Expertise
                                                </Typography>
                                            </div>
                                            <Box sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                gap: 2,
                                                mt: 2,
                                            }}>
                                                {selectedEmployee.skills.map((skill, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <Box sx={{
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            background: 'rgba(255, 255, 255, 0.7)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(49, 17, 136, 0.1)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-3px)',
                                                                boxShadow: '0 8px 20px rgba(49, 17, 136, 0.1)',
                                                                background: 'rgba(255, 255, 255, 0.9)',
                                                            }
                                                        }}>
                                                            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                                                {skill.name}
                                                            </Typography>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 60 : 30}
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    backgroundColor: 'rgba(49, 17, 136, 0.1)',
                                                                    '& .MuiLinearProgress-bar': {
                                                                        background: 'linear-gradient(90deg, #311188, #22c55e)',
                                                                        borderRadius: 3,
                                                                    }
                                                                }}
                                                            />
                                                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                                                                {skill.level}
                                                            </Typography>
                                                        </Box>
                                                    </motion.div>
                                                ))}
                                            </Box>
                                        </motion.div>
                                    )}

                                    {/* Certifications */}
                                    {selectedEmployee.certifications?.length > 0 && (
                                        <motion.div
                                            className="detail-item"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            style={{ gridColumn: '1 / -1' }}
                                        >
                                            <div className="flex justify-start items-center gap-2">
                                                <div className="detail-icon">
                                                    <School />
                                                </div>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    Certifications
                                                </Typography>
                                            </div>

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                {selectedEmployee.certifications.map((cert, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        style={{ flex: '1 1 300px' }}
                                                    >
                                                        <Box sx={{
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            background: 'rgba(255, 255, 255, 0.7)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(49, 17, 136, 0.1)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-3px)',
                                                                boxShadow: '0 8px 30px rgba(49, 17, 136, 0.15)',
                                                                background: 'rgba(255, 255, 255, 0.9)',
                                                            }
                                                        }}>
                                                            <Typography variant="subtitle1" fontWeight="600">
                                                                {cert.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                                {cert.issuer}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                                                    {format(new Date(cert.issueDate), 'MMM yyyy')}
                                                                </Typography>
                                                                {cert.certificateUrl && (
                                                                    <Button
                                                                        size="small"
                                                                        startIcon={<OpenInNew />}
                                                                        href={cert.certificateUrl}
                                                                        target="_blank"
                                                                        sx={{
                                                                            background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.1), rgba(34, 197, 94, 0.1))',
                                                                            borderRadius: '8px',
                                                                            '&:hover': {
                                                                                background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.2), rgba(34, 197, 94, 0.2))',
                                                                            }
                                                                        }}
                                                                    >
                                                                        View
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </motion.div>
                                                ))}
                                            </Box>
                                        </motion.div>
                                    )}
                                </div>
                            </DetailSection>
                        </DialogContent>
                    </>
                )}
            </DetailModal>

            {/* Certificate Modal */}
            <Dialog
                open={certModalOpen}
                onClose={() => setCertModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        overflow: 'hidden'
                    }
                }}
            >
                {selectedCertificate && (
                    <>
                        <DialogTitle
                            sx={{
                                background: 'linear-gradient(135deg, #311188, #22c55e)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: { xs: 2, sm: 3 }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <School sx={{ fontSize: { xs: 24, sm: 32 } }} />
                                <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                                    Certificate Details
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={() => setCertModalOpen(false)}
                                sx={{ color: 'white' }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" color="primary" gutterBottom fontWeight="600">
                                    {selectedCertificate.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {selectedCertificate.issuer}
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        background: 'rgba(49, 17, 136, 0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <CalendarToday color="primary" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Issue Date
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500">
                                                {format(new Date(selectedCertificate.issueDate), 'MMMM dd, yyyy')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                {selectedCertificate.certificateUrl && (
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            mt: 2,
                                            p: 3,
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.05), rgba(34, 197, 94, 0.05))',
                                            textAlign: 'center'
                                        }}>
                                            <Typography variant="body1" gutterBottom>
                                                View your certificate online
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<OpenInNew />}
                                                href={selectedCertificate.certificateUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    mt: 2,
                                                    background: 'linear-gradient(135deg, #311188, #22c55e)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #22c55e, #311188)',
                                                    }
                                                }}
                                            >
                                                Open Certificate
                                            </Button>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </PageContainer>
    );
};

export default SkillPath; 