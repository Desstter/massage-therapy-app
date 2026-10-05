export interface MuscleModelEntry {
  muscleId: string
  structures: string[]
}

/**
 * BodyParts3D structures used by the interactive atlas.
 *
 * A study concept can contain several distinct bilateral anatomical meshes
 * (for example, the three heads of triceps). Keeping those meshes separate
 * preserves the scientific source geometry while presenting a useful massage
 * therapy grouping in the interface.
 */
export const MUSCLE_MODELS: MuscleModelEntry[] = [
  { muscleId: 'trap-upper', structures: ['FMA33586', 'FMA33587'] },
  { muscleId: 'trap-middle', structures: ['FMA33584', 'FMA33585'] },
  { muscleId: 'trap-lower', structures: ['FMA33581', 'FMA33583'] },
  { muscleId: 'lats', structures: ['FMA13358', 'FMA13359'] },
  { muscleId: 'rhomboid-major', structures: ['FMA13381', 'FMA13382'] },
  { muscleId: 'rhomboid-minor', structures: ['FMA13383', 'FMA13384'] },
  {
    muscleId: 'erector-spinae',
    structures: [
      'FMA22740', 'FMA22741', 'FMA22742', 'FMA22743', 'FMA22744', 'FMA22745',
      'FMA22751', 'FMA22753', 'FMA22754', 'FMA22756', 'FMA22757', 'FMA22758',
      'FMA22779', 'FMA22780',
    ],
  },
  { muscleId: 'quadratus-lumborum', structures: ['FMA22348', 'FMA22349'] },
  { muscleId: 'multifidus', structures: ['FMA22878', 'FMA22879'] },
  { muscleId: 'deltoid-anterior', structures: ['FMA34680', 'FMA34681'] },
  { muscleId: 'deltoid-middle', structures: ['FMA34682', 'FMA34683'] },
  { muscleId: 'deltoid-posterior', structures: ['FMA34684', 'FMA34685'] },
  { muscleId: 'supraspinatus', structures: ['FMA32544', 'FMA32545'] },
  { muscleId: 'infraspinatus', structures: ['FMA32547', 'FMA32548'] },
  { muscleId: 'teres-minor', structures: ['FMA32553', 'FMA32554'] },
  { muscleId: 'subscapularis', structures: ['FMA13414', 'FMA13415'] },
  {
    muscleId: 'pec-major',
    structures: ['FMA34690', 'FMA34691', 'FMA79979', 'FMA79980', 'FMA45874', 'FMA45875'],
  },
  { muscleId: 'pec-minor', structures: ['FMA13375', 'FMA13376'] },
  { muscleId: 'serratus-anterior', structures: ['FMA13398', 'FMA13399'] },
  { muscleId: 'scm', structures: ['FMA13408', 'FMA13409'] },
  {
    muscleId: 'scalenes',
    structures: ['FMA13388', 'FMA13389', 'FMA13390', 'FMA13391', 'FMA13392', 'FMA13393'],
  },
  { muscleId: 'levator-scapulae', structures: ['FMA32540', 'FMA32541'] },
  {
    muscleId: 'suboccipitals',
    structures: ['FMA32530', 'FMA32531', 'FMA32532', 'FMA32533', 'FMA32534', 'FMA32535', 'FMA32536', 'FMA32537'],
  },
  { muscleId: 'splenius-capitis', structures: ['FMA22728', 'FMA22729'] },
  { muscleId: 'biceps-brachii', structures: ['FMA37684', 'FMA37685', 'FMA37686', 'FMA37687'] },
  {
    muscleId: 'triceps-brachii',
    structures: ['FMA37695', 'FMA37696', 'FMA37697', 'FMA37698', 'FMA37699', 'FMA37700'],
  },
  { muscleId: 'brachialis', structures: ['FMA37668', 'FMA37669'] },
  {
    muscleId: 'wrist-flexors',
    structures: ['FMA38460', 'FMA38461', 'FMA38463', 'FMA38464', 'FMA38479', 'FMA38480', 'FMA38470', 'FMA38471'],
  },
  {
    muscleId: 'wrist-extensors',
    structures: ['FMA38495', 'FMA38496', 'FMA38498', 'FMA38499', 'FMA38501', 'FMA38502', 'FMA38507', 'FMA38508'],
  },
  { muscleId: 'glute-max', structures: ['FMA22328', 'FMA22329'] },
  { muscleId: 'glute-med', structures: ['FMA22330', 'FMA22331'] },
  { muscleId: 'piriformis', structures: ['FMA22340', 'FMA22341'] },
  { muscleId: 'iliopsoas', structures: ['FMA22322', 'FMA22323', 'FMA22342', 'FMA22343'] },
  { muscleId: 'tfl', structures: ['FMA22425', 'FMA22426'] },
  { muscleId: 'rectus-femoris', structures: ['FMA38928', 'FMA38929'] },
  {
    muscleId: 'hamstrings',
    structures: ['FMA22358', 'FMA22359', 'FMA22448', 'FMA22449', 'FMA45888', 'FMA45889', 'FMA45891', 'FMA45892'],
  },
  {
    muscleId: 'adductors',
    structures: ['FMA22452', 'FMA22454', 'FMA22456', 'FMA22457', 'FMA22459', 'FMA22460', 'FMA43883', 'FMA43884'],
  },
  {
    muscleId: 'gastrocnemius',
    structures: ['FMA45957', 'FMA45958', 'FMA45960', 'FMA45961'],
  },
  { muscleId: 'soleus', structures: ['FMA22558', 'FMA22559'] },
  { muscleId: 'tibialis-anterior', structures: ['FMA22544', 'FMA22545'] },
  {
    muscleId: 'peroneals',
    structures: ['FMA22550', 'FMA22551', 'FMA22552', 'FMA22553', 'FMA22554', 'FMA22555'],
  },
]

export const MODEL_STRUCTURE_COUNT = MUSCLE_MODELS.reduce(
  (total, entry) => total + entry.structures.length,
  0,
)
