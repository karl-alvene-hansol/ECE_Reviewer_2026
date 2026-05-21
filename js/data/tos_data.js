// ============================================================
// TOS_DATA.JS — PRC ECE Licensure Exam Table of Specifications
// Official 2022 TOS data, structured for checklist integration
// Each topic has: id, name, subtopics, weight, difficulty hint
// ============================================================

const TOS_DATA = [
  // ══════════════════════════════════════════════════════════════
  //  MATHEMATICS  (20% · 100 items)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'MATH',
    subject: 'Mathematics',
    subjectId: 'Mathematics',
    subClass: 'math',
    color: '#3b82f6',
    icon: 'ti-math',
    weight: 20,
    totalItems: 100,
    courses: [
      {
        id: 'MATH-01',
        name: '1.0 Differential Calculus',
        weight: '3%',
        items: 15,
        subtopics: [
          { id: 'MATH-01-01', name: 'Functions, Continuity, and Limits' },
          { id: 'MATH-01-02', name: 'Derivatives and Its Applications' },
          { id: 'MATH-01-03', name: 'Higher-Order Derivatives' },
          { id: 'MATH-01-04', name: 'Parametric Equations' },
          { id: 'MATH-01-05', name: 'Partial Differentiation' },
        ],
      },
      {
        id: 'MATH-02',
        name: '2.0 Integral Calculus',
        weight: '3%',
        items: 15,
        subtopics: [
          { id: 'MATH-02-01', name: 'Integration Concepts / Formulas' },
          { id: 'MATH-02-02', name: 'Integration Techniques' },
          { id: 'MATH-02-03', name: 'Improper Integrals' },
          { id: 'MATH-02-04', name: 'Application of Integral' },
          { id: 'MATH-02-05', name: 'Multiple Integration and its Application' },
        ],
      },
      {
        id: 'MATH-03',
        name: '3.0 Differential Equation',
        weight: '3%',
        items: 15,
        subtopics: [
          { id: 'MATH-03-01', name: 'First-Order, First-Degree ODE and its Applications' },
          { id: 'MATH-03-02', name: 'Higher-Order ODE and its Application' },
          { id: 'MATH-03-03', name: 'Laplace Transforms, Inverses, and its Applications' },
        ],
      },
      {
        id: 'MATH-04',
        name: '4.0 Advanced Engineering Mathematics for ECE',
        weight: '3%',
        items: 15,
        subtopics: [
          { id: 'MATH-04-01', name: 'Complex Numbers and its Applications' },
          { id: 'MATH-04-02', name: 'Series and Transforms (Power Series, Bessel, Legendre, Fourier)' },
          { id: 'MATH-04-03', name: 'Partial Differential Equations' },
          { id: 'MATH-04-04', name: 'Simultaneous Linear and Non-linear Equations' },
          { id: 'MATH-04-05', name: 'Numerical Differentiation, Integration and Optimization' },
        ],
      },
      {
        id: 'MATH-05',
        name: '5.0 Engineering Data Analysis',
        weight: '3%',
        items: 15,
        subtopics: [
          { id: 'MATH-05-01', name: 'Obtaining Data' },
          { id: 'MATH-05-02', name: 'Statistical Sampling, Distribution, and Intervals' },
          { id: 'MATH-05-03', name: 'Test of Hypothesis' },
          { id: 'MATH-05-04', name: 'Regression and Correlation' },
          { id: 'MATH-05-05', name: 'Design of Experiments' },
        ],
      },
      {
        id: 'MATH-06',
        name: '6.0 Electromagnetics (shared with Electronics)',
        weight: '1.8%',
        items: 9,
        subtopics: [
          { id: 'MATH-06-01', name: 'Vector Analysis' },
          { id: 'MATH-06-02', name: 'Directional Derivative, Gradient, Divergence, Curl' },
          { id: 'MATH-06-03', name: "Integral Theorems, Green's Lemma, Divergence Theorem, Stokes' Theorem" },
        ],
      },
      {
        id: 'MATH-07',
        name: '7.0 Signals, Spectra & Signal Processing (shared with EST)',
        weight: '1.6%',
        items: 8,
        subtopics: [
          { id: 'MATH-07-01', name: 'Z-Transforms' },
          { id: 'MATH-07-02', name: 'Convolution' },
          { id: 'MATH-07-03', name: 'Correlation' },
        ],
      },
      {
        id: 'MATH-08',
        name: '8.0 Feedback and Control Systems (shared with Electronics)',
        weight: '1.6%',
        items: 8,
        subtopics: [
          { id: 'MATH-08-01', name: 'Pole and Zero Determination' },
          { id: 'MATH-08-02', name: 'Transient Response' },
          { id: 'MATH-08-03', name: 'Block Diagram and Signal Flow' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  GEAS  (20% · 100 items)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'GEAS',
    subject: 'GEAS',
    subjectId: 'GEAS',
    subClass: 'geas',
    color: '#10b981',
    icon: 'ti-flask',
    weight: 20,
    totalItems: 100,
    courses: [
      {
        id: 'GEAS-01',
        name: '1.0 Chemistry for Engineers',
        weight: '2%',
        items: 10,
        subtopics: [
          { id: 'GEAS-01-01', name: 'Energy' },
          { id: 'GEAS-01-02', name: 'Chemistry of Engineering Materials' },
          { id: 'GEAS-01-03', name: 'Chemistry of Nanomaterials' },
          { id: 'GEAS-01-04', name: 'Chemistry of the Environment and Special Topics' },
        ],
      },
      {
        id: 'GEAS-02',
        name: '2.0 Physics for Engineers',
        weight: '3%',
        items: 15,
        subtopics: [
          { id: 'GEAS-02-01', name: 'Work, Energy and Power / Impulse and Momentum' },
          { id: 'GEAS-02-02', name: 'Kinematics / Dynamics / Rotation' },
          { id: 'GEAS-02-03', name: 'Dynamic of Rotation / Elasticity / Oscillations / Waves' },
          { id: 'GEAS-02-04', name: 'Fluids / Heat Transfer' },
          { id: 'GEAS-02-05', name: 'Electrostatics / Electricity / Magnetism / Optics' },
        ],
      },
      {
        id: 'GEAS-03',
        name: '3.0 Engineering Economics',
        weight: '1.2%',
        items: 6,
        subtopics: [
          { id: 'GEAS-03-01', name: 'Engineering Economics Introduction Terms' },
          { id: 'GEAS-03-02', name: 'Money-Time Relationship and Equivalence / Basic Economy Study Methods' },
          { id: 'GEAS-03-03', name: 'Decisions Under Certainty' },
          { id: 'GEAS-03-04', name: 'Decisions Recognizing Risk / Decision Admitting Uncertainty' },
        ],
      },
      {
        id: 'GEAS-04',
        name: '4.0 Engineering Management',
        weight: '1.8%',
        items: 9,
        subtopics: [
          { id: 'GEAS-04-01', name: 'Evolution of Management Theory / Management and Its Function' },
          { id: 'GEAS-04-02', name: 'Planning / Leading / Organizing / Controlling' },
          { id: 'GEAS-04-03', name: 'Managing Product and Service Operations' },
          { id: 'GEAS-04-04', name: 'Managing the Marketing Function / Managing the Finance Function' },
        ],
      },
      {
        id: 'GEAS-05',
        name: '5.0 Technopreneurship 101',
        weight: '2%',
        items: 10,
        subtopics: [
          { id: 'GEAS-05-01', name: 'Technopreneurship Introduction / Ethics / Social Responsibility' },
          { id: 'GEAS-05-02', name: 'Customers / Value Proposition' },
          { id: 'GEAS-05-03', name: 'Market Identification and Analysis / Creating Competitive Advantage' },
          { id: 'GEAS-05-04', name: 'Business Models / Introduction to Intellectual Property' },
          { id: 'GEAS-05-05', name: 'Execution and Business Plan / Financial Analysis / Raising Capital' },
        ],
      },
      {
        id: 'GEAS-06',
        name: '6.0 Physics 2',
        weight: '2%',
        items: 10,
        subtopics: [
          { id: 'GEAS-06-01', name: 'Thermodynamics / Condensed Matter / Atomic/Nuclear' },
          { id: 'GEAS-06-02', name: 'Electricity / Magnetism / EM Induction' },
          { id: 'GEAS-06-03', name: 'Inductance / AC' },
          { id: 'GEAS-06-04', name: 'Optics' },
        ],
      },
      {
        id: 'GEAS-07',
        name: '7.0 Materials Science and Engineering',
        weight: '1.6%',
        items: 8,
        subtopics: [
          { id: 'GEAS-07-01', name: 'Atomic Structure and Interatomic Bonding' },
          { id: 'GEAS-07-02', name: 'Structure of Crystalline Materials' },
          { id: 'GEAS-07-03', name: 'Imperfections in Solid / Diffusion / Mechanical Properties' },
          { id: 'GEAS-07-04', name: 'Ceramics / Polymers / Composites' },
          { id: 'GEAS-07-05', name: 'Electrical / Dielectric / Magnetic / Optical / Thermal Properties' },
        ],
      },
      {
        id: 'GEAS-08',
        name: '8.0 Computer Programming',
        weight: '2%',
        items: 10,
        subtopics: [
          { id: 'GEAS-08-01', name: 'Introduction to OOP and UML / Object-Oriented Analysis and Design' },
          { id: 'GEAS-08-02', name: 'Programming Language Fundamentals / Advanced Programming' },
          { id: 'GEAS-08-03', name: 'Exception Handling' },
          { id: 'GEAS-08-04', name: 'Graphical User Interface Programming' },
        ],
      },
      {
        id: 'GEAS-09',
        name: '9.0 Environmental Science and Engineering',
        weight: '2%',
        items: 10,
        subtopics: [
          { id: 'GEAS-09-01', name: 'Nature and Ecology / Natural Systems and Resources' },
          { id: 'GEAS-09-02', name: 'Environmental Concerns and Crisis' },
          { id: 'GEAS-09-03', name: 'Environmental Impact Assessment' },
          { id: 'GEAS-09-04', name: 'Sustainable Development' },
        ],
      },
      {
        id: 'GEAS-10',
        name: '10.0 ECE Laws, Contracts, Ethics, Standards & Safety',
        weight: '2%',
        items: 10,
        subtopics: [
          { id: 'GEAS-10-01', name: 'Fundamentals of the Laws, Obligations and Contracts' },
          { id: 'GEAS-10-02', name: 'Pledge of ECE & CSC Guidelines / Board Examination / Regulating the ECE Profession' },
          { id: 'GEAS-10-03', name: 'Practicing the ECE Profession' },
          { id: 'GEAS-10-04', name: 'Other ECE Related Statutes / Safety Standards / PEC Codes' },
        ],
      },
      {
        id: 'GEAS-11',
        name: '11.0 CAD',
        weight: '0.4%',
        items: 2,
        subtopics: [
          { id: 'GEAS-11-01', name: 'Introduction to CAD Software and its Environment / Snapping / Construction Elements' },
          { id: 'GEAS-11-02', name: 'Dimensioning / Plotting and Inputting of Images' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  ELECTRONICS ENGINEERING  (30% · 100 items)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ELEX',
    subject: 'Electronics Engineering',
    subjectId: 'Electronics Eng.',
    subClass: 'elex',
    color: '#f59e0b',
    icon: 'ti-circuit-diode',
    weight: 30,
    totalItems: 100,
    courses: [
      {
        id: 'ELEX-01',
        name: '1.0 DC Electrical Circuits',
        weight: '3.6%',
        items: 12,
        subtopics: [
          { id: 'ELEX-01-01', name: 'Resistive Network' },
          { id: 'ELEX-01-02', name: 'Mesh and Node Equations' },
          { id: 'ELEX-01-03', name: 'Network Theorems' },
          { id: 'ELEX-01-04', name: 'Transient Analysis' },
          { id: 'ELEX-01-05', name: 'Solution to DC Network Problems' },
        ],
      },
      {
        id: 'ELEX-02',
        name: '2.0 AC Electrical Circuits',
        weight: '3.6%',
        items: 12,
        subtopics: [
          { id: 'ELEX-02-01', name: 'Solution to AC Network Problems' },
          { id: 'ELEX-02-02', name: 'Impedance and Admittance' },
          { id: 'ELEX-02-03', name: 'Resonance' },
          { id: 'ELEX-02-04', name: 'Power in AC Circuits' },
          { id: 'ELEX-02-05', name: 'Two-Port Network Parameters and Transfer Function' },
        ],
      },
      {
        id: 'ELEX-03',
        name: '3.0 Electromagnetics (shared with Math)',
        weight: '2.4%',
        items: 8,
        subtopics: [
          { id: 'ELEX-03-01', name: 'Steady Electric and Magnetic Fields' },
          { id: 'ELEX-03-02', name: 'Dielectric and Magnetic Materials' },
          { id: 'ELEX-03-03', name: 'Coupled and Magnetic Circuits' },
          { id: 'ELEX-03-04', name: "Time-Varying Fields and Maxwell's Equation" },
        ],
      },
      {
        id: 'ELEX-04',
        name: '4.0 Electronic Devices and Circuits',
        weight: '4.2%',
        items: 14,
        subtopics: [
          { id: 'ELEX-04-01', name: 'Diode Wave Shaping Circuits and Special Diode Applications' },
          { id: 'ELEX-04-02', name: 'BJT and FET Small Signal Analysis' },
          { id: 'ELEX-04-03', name: 'Diode Equivalent Circuits' },
          { id: 'ELEX-04-04', name: 'Voltage Multipliers, Power Supply, and Voltage Regulation' },
          { id: 'ELEX-04-05', name: 'Bipolar Junction Transistor and FET' },
        ],
      },
      {
        id: 'ELEX-05',
        name: '5.0 Electronic Circuit Analysis and Design',
        weight: '4.2%',
        items: 14,
        subtopics: [
          { id: 'ELEX-05-01', name: 'BJT and FET Frequency Response' },
          { id: 'ELEX-05-02', name: 'Cascade and Cascode Connections' },
          { id: 'ELEX-05-03', name: 'Current Mirrors and Current Source' },
          { id: 'ELEX-05-04', name: 'Differential and Operational Amplifier' },
          { id: 'ELEX-05-05', name: 'Feedback Systems, Oscillators, and Filters' },
        ],
      },
      {
        id: 'ELEX-06',
        name: '6.0 Electronic Systems and Design (shared with EST)',
        weight: '2.4%',
        items: 8,
        subtopics: [
          { id: 'ELEX-06-01', name: "SCR's, UJT, PUT, TRIAC, DIAC, and other Thyristors" },
          { id: 'ELEX-06-02', name: 'Optoelectronic Devices and Sensors' },
          { id: 'ELEX-06-03', name: 'Transducers, Data Acquisition, and Interfacing Techniques' },
          { id: 'ELEX-06-04', name: 'Programmable Logic Controllers' },
          { id: 'ELEX-06-05', name: 'Design and Integration in Building Management Systems, HVAC, Security, Audio-Video' },
        ],
      },
      {
        id: 'ELEX-07',
        name: '7.0 Logic Circuits and Switching Theory',
        weight: '3.6%',
        items: 12,
        subtopics: [
          { id: 'ELEX-07-01', name: 'Boolean Algebra and Logic Gates' },
          { id: 'ELEX-07-02', name: 'Minimization of Combinational Logic Circuits' },
          { id: 'ELEX-07-03', name: 'Sequential Logic Circuits' },
          { id: 'ELEX-07-04', name: 'Algorithmic State Machine (ASM)' },
          { id: 'ELEX-07-05', name: 'Asynchronous Sequential Logic' },
        ],
      },
      {
        id: 'ELEX-08',
        name: '8.0 Microprocessor & Microcontroller Systems and Design',
        weight: '3.6%',
        items: 12,
        subtopics: [
          { id: 'ELEX-08-01', name: 'Microprocessor Unit' },
          { id: 'ELEX-08-02', name: 'Memory Subsystem' },
          { id: 'ELEX-08-03', name: 'I/O Subsystem' },
          { id: 'ELEX-08-04', name: 'Instruction Set Architecture and Assembly Programming' },
          { id: 'ELEX-08-05', name: 'Microcontrollers' },
        ],
      },
      {
        id: 'ELEX-09',
        name: '9.0 Feedback and Control Systems (shared with Math)',
        weight: '2.4%',
        items: 8,
        subtopics: [
          { id: 'ELEX-09-01', name: 'Block Diagram Representation and Signal Flow Graphs' },
          { id: 'ELEX-09-02', name: 'LTI Systems and Transient Analysis' },
          { id: 'ELEX-09-03', name: 'System Modeling and Transfer Function' },
          { id: 'ELEX-09-04', name: 'Poles and Zeros, Root Locus, and Stability Analysis' },
          { id: 'ELEX-09-05', name: 'Steady State Analysis and Frequency Response' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  //  EST — Electronics Systems & Technologies  (30% · 100 items)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'EST',
    subject: 'EST',
    subjectId: 'EST',
    subClass: 'est',
    color: '#8b5cf6',
    icon: 'ti-antenna',
    weight: 30,
    totalItems: 100,
    courses: [
      {
        id: 'EST-01',
        name: '1.0 Signals, Spectra, Signal Processing',
        weight: '1%',
        items: 10,
        subtopics: [
          { id: 'EST-01-01', name: 'Classification and Characteristics of Signals' },
          { id: 'EST-01-02', name: 'Sampling Theorem and Aliasing' },
          { id: 'EST-01-03', name: 'Difference Equations for FIR and IIR Filters' },
          { id: 'EST-01-04', name: 'Convolution and Correlation / Z-Transforms / Fourier Transforms / FIR/IIR' },
        ],
      },
      {
        id: 'EST-02',
        name: '2.0 Principles of Communications',
        weight: '7.5%',
        items: 25,
        subtopics: [
          { id: 'EST-02-01', name: 'Introduction to Communications Systems' },
          { id: 'EST-02-02', name: 'Noise' },
          { id: 'EST-02-03', name: 'Amplitude Modulation / Single-Sideband Techniques / Frequency Modulation' },
          { id: 'EST-02-04', name: 'Radio Receivers' },
          { id: 'EST-02-05', name: 'Pulse Modulation / Digital Modulation / Broadband Communication Systems' },
        ],
      },
      {
        id: 'EST-03',
        name: '3.0 Digital Communications',
        weight: '4.5%',
        items: 15,
        subtopics: [
          { id: 'EST-03-01', name: 'Introduction to Digital Communications Systems' },
          { id: 'EST-03-02', name: 'Digital Transmission / PAM / PWM / PPM / Pulse Code Modulation' },
          { id: 'EST-03-03', name: 'Digital Communications / ASK / FSK / PSK / QAM' },
          { id: 'EST-03-04', name: 'Basics of Information Theory / Error Detection' },
          { id: 'EST-03-05', name: 'FDM / TDM / WDM / FDMA / CDMA / TDMA' },
        ],
      },
      {
        id: 'EST-04',
        name: '4.0 Transmission and Antenna Systems',
        weight: '6.9%',
        items: 23,
        subtopics: [
          { id: 'EST-04-01', name: 'Transmission Line Circuits / Losses and Parameters / Matching TL / Smith Chart' },
          { id: 'EST-04-02', name: 'Radio Wave Propagation / Power Density and Field Strength Calculations' },
          { id: 'EST-04-03', name: 'Antenna Systems' },
          { id: 'EST-04-04', name: 'Waveguides / Fiber Optics' },
        ],
      },
      {
        id: 'EST-05',
        name: '5.0 Electronics 3: Electronic Systems and Design',
        weight: '2.1%',
        items: 7,
        subtopics: [
          { id: 'EST-05-01', name: 'Optoelectronic Devices and Sensors / Transducers' },
          { id: 'EST-05-02', name: 'Interfacing Techniques / Programmable Logic Controllers' },
          { id: 'EST-05-03', name: 'Building Management Systems / HVAC / Security / SCADA / Fire and Life Safety' },
        ],
      },
      {
        id: 'EST-06',
        name: '6.0 Data Communications',
        weight: '6%',
        items: 20,
        subtopics: [
          { id: 'EST-06-01', name: 'Introduction to Data Communications / Category / Configurations / Network Topology' },
          { id: 'EST-06-02', name: 'Transmission Modes / Two-wire vs. Four-Wire Circuits' },
          { id: 'EST-06-03', name: 'Types of Synchronization / Network Components / Security / Cryptography' },
          { id: 'EST-06-04', name: 'OSI Model / TCP/IP Architecture / Protocols (Character & Bit-Oriented)' },
          { id: 'EST-06-05', name: 'LAN / MAN / WAN / GAN / ISDN / B-ISDN' },
        ],
      },
    ],
  },
];
