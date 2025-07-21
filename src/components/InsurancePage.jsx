import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Paper,
  Avatar,
  MobileStepper,
  useTheme,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeableViews from 'react-swipeable-views';
import {
  HealthAndSafety,
  LocalHospital,
  DirectionsCar,
  Home,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CreditCard,
  Shield,
  Security,
  AccountBalance,
} from '@mui/icons-material';
import LoadingScreen from './LoadingScreen';

// Styled components for the credit card design
const CreditCardContainer = styled(Box)(({ theme }) => ({
  perspective: '1500px',
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.05) 0%, rgba(10, 8, 30, 0.1) 100%)',
    zIndex: -1,
  },
}));

const InsuranceCreditCard = styled(motion.div)(({ theme, bgimage }) => ({
  width: '500px',
  height: '300px',
  position: 'relative',
  transformStyle: 'preserve-3d',
  borderRadius: '20px',
  background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)`,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${bgimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.5,
    zIndex: -1,
  },
}));

const CardOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(49, 17, 136, 0.8) 0%, rgba(10, 8, 30, 0.8) 100%)',
  opacity: 0.7,
  zIndex: 0,
});

const InsuranceCardContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
  padding: '30px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  color: 'white',
});

const CardChip = styled(Box)({
  width: '50px',
  height: '40px',
  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  borderRadius: '8px',
  marginBottom: '20px',
});

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const SlideContainer = styled(Box)(({ bgimage }) => ({
  width: '100%',
  height: '80vh',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${bgimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.3)',
    zIndex: 0,
  },
}));

const ContentWrapper = styled(Box)({
  width: '100%',
  maxWidth: '1500px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 48px',
  position: 'relative',
  zIndex: 1,
  gap: '48px',
});

const InsuranceDetails = styled(Box)(({ theme }) => ({
  flex: 1,
  color: 'white',
  maxWidth: '600px',
}));

const StatsFeatureList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(3),
}));

const StatsFeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const CoverageAmount = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(1),
  background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
  color: 'white',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(49, 17, 136, 0.2)',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
  boxShadow: '0 4px 12px rgba(49, 17, 136, 0.2)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const PolicySection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.5,
  },
}));

const PolicyGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(49, 17, 136, 0.05) 0%, transparent 70%)',
    zIndex: -1,
  },
}));

const PolicyCardWrapper = styled(motion.div)(({ theme }) => ({
  height: '100%',
  perspective: 1000,
}));

const PolicyCard = styled(motion.div)(({ theme }) => ({
  height: '600px', // Fixed height for all cards
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: 'linear-gradient(90deg, #311188 0%, #0A081E 100%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-10px) rotateX(2deg)',
    boxShadow: '0 20px 40px rgba(49, 17, 136, 0.2)',
    '&::after': {
      opacity: 0.8,
    },
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: 'rgba(49, 17, 136, 0.03)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const PolicyFeatureList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const PolicyFeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  background: 'rgba(49, 17, 136, 0.02)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(49, 17, 136, 0.05)',
    transform: 'translateX(5px)',
  },
}));

const ComprehensiveSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  width: '100%',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.5,
  },
}));

const InsuranceGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
  maxWidth: '1400px',
  margin: '0 auto',
  padding: theme.spacing(0, 2),
}));

const InsuranceCard = styled(motion.div)(({ theme }) => ({
  width: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.spacing(4),
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: {
    xs: '320px',
    sm: '350px',
    md: '380px'
  },
  maxWidth: {
    xs: '100%',
    sm: '480px',
    md: '520px'
  },
  margin: '0 auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #311188, #0A081E)',
  },
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(49, 17, 136, 0.15)',
  },
  '& .MuiCardContent-root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
}));

const CardTopSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
  color: 'white',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40px',
    background: 'linear-gradient(to top right, #fff 50%, transparent 51%)',
  },
}));

const IconCircle = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  border: '2px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    width: '60px',
    height: '60px',
    marginBottom: theme.spacing(1),
  },
  '&:hover': {
    transform: 'rotate(10deg)',
    background: 'rgba(255, 255, 255, 0.2)',
  },
}));

const BenefitList = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
  gap: { xs: 1, sm: 1.5, md: 2 },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
  },
}));

const BenefitItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  background: 'rgba(49, 17, 136, 0.03)',
  transition: 'all 0.2s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
  '&:hover': {
    background: 'rgba(49, 17, 136, 0.06)',
    transform: 'translateX(5px)',
  },
}));

const AmountChip = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(5px)',
  color: 'white',
  fontWeight: 600,
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.75, 1.5),
    marginTop: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
    },
  },
}));

const InsurancePage = () => {
  const [userData, setUserData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  const insuranceTypes = [
    {
      type: 'Health Insurance',
      amount: '₹500,000',
      icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
      bgImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80',
      color: '#4CAF50',
      benefits: ['Comprehensive medical ', '100% hospitalization ', 'Family floater option'],
      cardNumber: '4321 •••• •••• 1234',
    },
    {
      type: 'Life Insurance',
      amount: '₹2,000,000',
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      bgImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
      color: '#2196F3',
      benefits: ['Term life coverage', 'Accidental death benefit', 'Critical illness coverage'],
      cardNumber: '5678 •••• •••• 5678',
    },
    {
      type: 'Vehicle Insurance',
      amount: '₹100,000',
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      bgImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80',
      color: '#9C27B0',
      benefits: ['Comprehensive coverage', 'Third-party liability', '24/7 roadside assistance'],
      cardNumber: '9012 •••• •••• 9012',
    },
    {
      type: 'Home Insurance',
      amount: '₹1,000,000',
      icon: <Home sx={{ fontSize: 40 }} />,
      bgImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80',
      color: '#FF5722',
      benefits: ['Property coverage', 'Natural disaster protection', 'Content insurance'],
      cardNumber: '3456 •••• •••• 3456',
    },
  ];
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem('userData'));
      setUserData(storedUserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setTimeout(() => {
        setInitialLoading(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % insuranceTypes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [insuranceTypes.length]);

  const handleDotClick = (index) => {
    setActiveStep(index);
  };

  const maxSteps = insuranceTypes.length;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const features = {
    'Health Insurance': [
      { icon: <LocalHospital />, title: 'Hospital Coverage', desc: 'Full coverage for hospitalization' },
      { icon: <Security />, title: 'Family Protection', desc: 'Covers entire family' },
      { icon: <AccountBalance />, title: 'No Claim Bonus', desc: 'Up to 50% bonus' },
      { icon: <Shield />, title: 'Pre-existing Coverage', desc: 'After 2 years' },
    ],
    'Life Insurance': [
      { icon: <Shield />, title: 'Term Coverage', desc: 'Up to age 75' },
      { icon: <Security />, title: 'Accidental Benefit', desc: 'Double sum assured' },
      { icon: <AccountBalance />, title: 'Tax Benefits', desc: 'Under 80C' },
      { icon: <CreditCard />, title: 'Premium Waiver', desc: 'On disability' },
    ],
    'Vehicle Insurance': [
      { icon: <DirectionsCar />, title: 'Comprehensive Cover', desc: 'All risk coverage' },
      { icon: <Shield />, title: 'Third Party', desc: 'Liability coverage' },
      { icon: <Security />, title: 'Zero Depreciation', desc: 'Full claim amount' },
      { icon: <LocalHospital />, title: 'Personal Accident', desc: '₹15 lakh cover' },
    ],
    'Home Insurance': [
      { icon: <Home />, title: 'Structure Coverage', desc: 'Full rebuilding cost' },
      { icon: <Shield />, title: 'Contents Cover', desc: 'All belongings' },
      { icon: <Security />, title: 'Natural Disasters', desc: 'Complete protection' },
      { icon: <AccountBalance />, title: 'Rent Coverage', desc: 'Alternative accommodation' },
    ],
  };

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ background: '#000', position: 'relative' }}>
      <Box sx={{ position: 'relative', width: '100%', zIndex: 2 }}>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          style={{ width: '100%', height: '80vh' }}
        >
          {insuranceTypes.map((insurance, index) => (
            <div key={index}>
              {Math.abs(activeStep - index) <= 2 ? (
                <SlideContainer bgimage={insurance.bgImage}>
                  <ContentWrapper>
                    {/* Left side - Insurance Details */}
                    <InsuranceDetails>
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {insurance.type}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            mb: 3,
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 600,
                          }}
                        >
                          Coverage up to {insurance.amount}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            mb: 4,
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '1.1rem',
                            lineHeight: 1.6,
                          }}
                        >
                          {insurance.benefits.join(' • ')}
                        </Typography>

                        <StatsFeatureList>
                          {features[insurance.type].map((feature, idx) => (
                            <StatsFeatureItem key={idx}>
                              <Avatar
                                sx={{
                                  bgcolor: 'primary.main',
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                {feature.icon}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="600">
                                  {feature.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {feature.desc}
                                </Typography>
                              </Box>
                            </StatsFeatureItem>
                          ))}
                        </StatsFeatureList>
                      </motion.div>
                    </InsuranceDetails>

                    {/* Right side - Credit Card */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <InsuranceCreditCard
                          initial={{ rotateY: -90 }}
                          animate={{ rotateY: 0 }}
                          exit={{ rotateY: 90 }}
                          transition={{ duration: 0.6 }}
                          bgimage={insurance.bgImage}
                        >
                          <CardOverlay />
                          <InsuranceCardContent>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                {insurance.icon}
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{insurance.type}</Typography>
                              </Box>
                              <CardChip />
                              <Typography variant="h5" sx={{ mb: 1, fontFamily: 'monospace' }}>
                                {insurance.cardNumber}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1 }}>Card Holder</Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Typography variant="h6">{userData?.name || 'Loading...'}</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>{insurance.amount}</Typography>
                              </Box>
                            </Box>
                          </InsuranceCardContent>
                        </InsuranceCreditCard>
                      </motion.div>
                    </Box>
                  </ContentWrapper>
                </SlideContainer>
              ) : null}
            </div>
          ))}

        </SwipeableViews>
        {/* Carousel Dots - Now outside SwipeableViews to be visible on all pages */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            width: '100%',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {Array.from({ length: maxSteps }).map((_, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: activeStep === index ? 'white' : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    backgroundColor: activeStep === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>



      {/* Detailed Insurance Policies Section */}
      <ComprehensiveSection>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GradientText
              variant="h3"
              align="center"
              sx={{ mb: 6 }}
            >
              Comprehensive Insurance Coverage
            </GradientText>
          </motion.div>

          <Box 
            sx={{ 
              maxWidth: '1400px', 
              margin: '0 auto',
              px: { xs: 2, sm: 3, md: 4 }
            }}
          >
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3, md: 4 }}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {insuranceTypes.map((insurance, index) => (
                <Grid 
                  item 
                  xs={12} 
                  md={6} 
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      display: 'flex'
                    }}
                  >
                    <InsuranceCard
                      sx={{
                        width: '100%',
                        height: '100%',
                        minHeight: {
                          xs: '320px',
                          sm: '350px',
                          md: '380px'
                        },
                        maxWidth: {
                          xs: '100%',
                          sm: '480px',
                          md: '520px'
                        },
                        borderRadius: { xs: '16px', sm: '24px', md: '30px' },
                        '& .MuiCardContent-root': {
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }
                      }}
                    >
                      <CardTopSection
                        sx={{
                          p: { xs: 2, sm: 2.5, md: 3 },
                          minHeight: { xs: '100px', sm: '110px', md: '120px' }
                        }}
                      >
                        <IconCircle>
                          <Box sx={{ 
                            transform: { 
                              xs: 'scale(1.2)',
                              sm: 'scale(1.3)',
                              md: 'scale(1.5)' 
                            }
                          }}>
                            {insurance.icon}
                          </Box>
                        </IconCircle>
                        <Typography 
                          variant="h5" 
                          fontWeight="600" 
                          gutterBottom
                          sx={{
                            fontSize: {
                              xs: '1.25rem',
                              sm: '1.5rem',
                              md: '1.75rem'
                            }
                          }}
                        >
                          {insurance.type}
                        </Typography>
                        <AmountChip>
                          <AccountBalance sx={{ 
                            fontSize: {
                              xs: 16,
                              sm: 18,
                              md: 20
                            }
                          }} />
                          {insurance.amount}
                        </AmountChip>
                      </CardTopSection>

                      <Box 
                        sx={{ 
                          p: { xs: 2, sm: 2.5, md: 3 },
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          color="primary"
                          gutterBottom
                          sx={{
                            fontSize: {
                              xs: '0.875rem',
                              sm: '1rem',
                              md: '1.1rem'
                            },
                            mb: 2
                          }}
                        >
                          Key Benefits
                        </Typography>
                        <BenefitList 
                          sx={{ 
                            flex: 1,
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                            gap: { xs: 1, sm: 1.5, md: 2 }
                          }}
                        >
                          {features[insurance.type].map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <BenefitItem>
                                <Box
                                  sx={{
                                    color: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& .MuiSvgIcon-root': {
                                      fontSize: {
                                        xs: '1.25rem',
                                        sm: '1.5rem',
                                        md: '1.75rem'
                                      }
                                    }
                                  }}
                                >
                                  {feature.icon}
                                </Box>
                                <Box>
                                  <Typography 
                                    variant="body2" 
                                    fontWeight="600"
                                    sx={{
                                      fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem',
                                        md: '1rem'
                                      }
                                    }}
                                  >
                                    {feature.title}
                                  </Typography>
                                  <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{
                                      fontSize: {
                                        xs: '0.7rem',
                                        sm: '0.75rem',
                                        md: '0.875rem'
                                      }
                                    }}
                                  >
                                    {feature.desc}
                                  </Typography>
                                </Box>
                              </BenefitItem>
                            </motion.div>
                          ))}
                        </BenefitList>

                        <Box
                          sx={{
                            pt: 2,
                            mt: 'auto',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: { xs: 0.5, sm: 0.75, md: 1 },
                            justifyContent: 'flex-start'
                          }}
                        >
                          {insurance.benefits.map((benefit, idx) => (
                            <Chip
                              key={idx}
                              label={benefit}
                              size="small"
                              icon={<Shield sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />}
                              sx={{
                                background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',
                                color: 'white',
                                fontSize: {
                                  xs: '0.7rem',
                                  sm: '0.75rem',
                                  md: '0.875rem'
                                },
                                py: 0.5,
                                height: 'auto',
                                '& .MuiChip-icon': {
                                  color: 'white',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </InsuranceCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </ComprehensiveSection>
    </Box>
  );
};

export default InsurancePage;
