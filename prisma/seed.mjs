import bcrypt from "bcryptjs";
import {
  PrismaClient,
  RoleCode,
  BillingPeriod,
  EnrollmentStatus,
  ReceiptStatus,
  RemittanceStatus,
  PaymentMovementType,
  AttendanceStatus,
  CommunicationType,
  CommunicationTargetType,
  ImportStatus,
  ImportType,
} from "@prisma/client";

const prisma = new PrismaClient();

const permissionCatalog = [
  { code: "dashboard.read", description: "Read dashboard metrics" },
  { code: "students.read", description: "Read student records" },
  { code: "students.write", description: "Write student records" },
  { code: "teachers.read", description: "Read teacher records" },
  { code: "teachers.write", description: "Write teacher records" },
  { code: "classes.read", description: "Read classes and groups" },
  { code: "classes.write", description: "Write classes and groups" },
  { code: "attendance.read", description: "Read attendance data" },
  { code: "attendance.write", description: "Write attendance data" },
  { code: "billing.read", description: "Read billing data" },
  { code: "billing.write", description: "Write billing data" },
  { code: "remittances.manage", description: "Generate and manage remittances" },
  { code: "reports.read", description: "Read reports" },
  { code: "communications.read", description: "Read communications" },
  { code: "communications.write", description: "Write communications" },
  { code: "site.config.write", description: "Edit site-level configuration" },
  { code: "users.manage", description: "Manage users and role assignments" },
  { code: "audit.read", description: "Read audit logs" },
  { code: "import.excel", description: "Run Excel imports" },
];

const roleDefinitions = [
  { code: RoleCode.DEVELOPER, name: "Developer / Owner" },
  { code: RoleCode.ADMIN_GLOBAL, name: "Admin global" },
  { code: RoleCode.ADMIN_SEDE, name: "Admin sede" },
  { code: RoleCode.OPERADOR_SEDE, name: "Operador sede" },
  { code: RoleCode.PROFESOR_SEDE, name: "Profesor sede" },
  { code: RoleCode.ALUMNO_TUTOR, name: "Alumno / Tutor" },
];

const rolePermissionMatrix = {
  [RoleCode.DEVELOPER]: permissionCatalog.map((p) => p.code),
  [RoleCode.ADMIN_GLOBAL]: [
    "dashboard.read",
    "students.read",
    "students.write",
    "teachers.read",
    "teachers.write",
    "classes.read",
    "classes.write",
    "attendance.read",
    "attendance.write",
    "billing.read",
    "billing.write",
    "remittances.manage",
    "reports.read",
    "communications.read",
    "communications.write",
    "users.manage",
    "audit.read",
    "import.excel",
  ],
  [RoleCode.ADMIN_SEDE]: [
    "dashboard.read",
    "students.read",
    "students.write",
    "teachers.read",
    "teachers.write",
    "classes.read",
    "classes.write",
    "attendance.read",
    "attendance.write",
    "billing.read",
    "billing.write",
    "remittances.manage",
    "reports.read",
    "communications.read",
    "communications.write",
    "import.excel",
  ],
  [RoleCode.OPERADOR_SEDE]: [
    "dashboard.read",
    "students.read",
    "students.write",
    "teachers.read",
    "classes.read",
    "classes.write",
    "attendance.read",
    "attendance.write",
    "billing.read",
    "communications.read",
    "communications.write",
    "reports.read",
  ],
  [RoleCode.PROFESOR_SEDE]: [
    "dashboard.read",
    "students.read",
    "teachers.read",
    "classes.read",
    "classes.write",
    "attendance.read",
    "attendance.write",
    "communications.read",
    "communications.write",
  ],
  [RoleCode.ALUMNO_TUTOR]: [
    "dashboard.read",
    "students.read",
    "billing.read",
    "communications.read",
  ],
};

const defaultPassword = process.env.SEED_DEFAULT_PASSWORD ?? "Kodaore2026!";

async function createRolesAndPermissions() {
  for (const permission of permissionCatalog) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: { description: permission.description },
      create: permission,
    });
  }

  for (const role of roleDefinitions) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name },
      create: role,
    });
  }

  for (const role of roleDefinitions) {
    const dbRole = await prisma.role.findUniqueOrThrow({ where: { code: role.code } });
    await prisma.rolePermission.deleteMany({ where: { roleId: dbRole.id } });

    const permissionCodes = rolePermissionMatrix[role.code] ?? [];
    for (const permissionCode of permissionCodes) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { code: permissionCode },
      });

      await prisma.rolePermission.create({
        data: {
          roleId: dbRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

async function createSites() {
  const sites = [
    { code: "azkoitia", name: "Azkoitia" },
    { code: "azpeitia", name: "Azpeitia" },
    { code: "zumaia", name: "Zumaia" },
  ];

  for (const site of sites) {
    await prisma.site.upsert({
      where: { code: site.code },
      update: { name: site.name, isActive: true },
      create: site,
    });
  }
}

async function createUsersAndAssignments() {
  const hash = await bcrypt.hash(defaultPassword, 10);

  const users = {
    developer: await prisma.user.upsert({
      where: { username: "developer" },
      update: {
        username: "developer",
        email: null,
        firstName: "Kodaore",
        lastName: "Developer",
        status: "ACTIVE",
        preferredLocale: "eu",
      },
      create: {
        username: "developer",
        email: null,
        passwordHash: hash,
        firstName: "Kodaore",
        lastName: "Developer",
        preferredLocale: "eu",
      },
    }),
    adminGlobal: await prisma.user.upsert({
      where: { username: "admin.global" },
      update: {
        username: "admin.global",
        email: null,
        firstName: "Admin",
        lastName: "Global",
        preferredLocale: "eu",
      },
      create: {
        username: "admin.global",
        email: null,
        passwordHash: hash,
        firstName: "Admin",
        lastName: "Global",
        preferredLocale: "eu",
      },
    }),
    tutor: await prisma.user.upsert({
      where: { email: "familia@kodaore.eus" },
      update: {
        username: null,
        firstName: "Ane",
        lastName: "Garmendia",
        phone: "600000001",
        preferredLocale: "eu",
      },
      create: {
        username: null,
        email: "familia@kodaore.eus",
        passwordHash: hash,
        firstName: "Ane",
        lastName: "Garmendia",
        phone: "600000001",
        preferredLocale: "eu",
      },
    }),
  };

  const [developerRole, adminGlobalRole, adminSedeRole, operadorSedeRole, profesorSedeRole, alumnoTutorRole] =
    await Promise.all([
      prisma.role.findUniqueOrThrow({ where: { code: RoleCode.DEVELOPER } }),
      prisma.role.findUniqueOrThrow({ where: { code: RoleCode.ADMIN_GLOBAL } }),
      prisma.role.findUniqueOrThrow({ where: { code: RoleCode.ADMIN_SEDE } }),
      prisma.role.findUniqueOrThrow({ where: { code: RoleCode.OPERADOR_SEDE } }),
      prisma.role.findUniqueOrThrow({ where: { code: RoleCode.PROFESOR_SEDE } }),
      prisma.role.findUniqueOrThrow({ where: { code: RoleCode.ALUMNO_TUTOR } }),
    ]);

  const sites = await prisma.site.findMany({ orderBy: { name: "asc" } });

  const upsertRole = async ({ userId, roleId, siteId = null }) => {
    await prisma.userSiteRole.create({
      data: {
        userId,
        roleId,
        siteId,
        isActive: true,
      },
    });
  };

  await prisma.userSiteRole.deleteMany({
    where: {
      userId: {
        in: [users.developer.id, users.adminGlobal.id, users.tutor.id],
      },
    },
  });

  await upsertRole({ userId: users.developer.id, roleId: developerRole.id });
  await upsertRole({ userId: users.adminGlobal.id, roleId: adminGlobalRole.id });
  await upsertRole({ userId: users.tutor.id, roleId: alumnoTutorRole.id });

  for (const site of sites) {
    const emailSlug = site.code;
    const adminSede = await prisma.user.upsert({
      where: { username: `admin.${emailSlug}` },
      update: {
        username: `admin.${emailSlug}`,
        email: null,
        firstName: "Admin",
        lastName: site.name,
        preferredLocale: "eu",
      },
      create: {
        username: `admin.${emailSlug}`,
        email: null,
        passwordHash: hash,
        firstName: "Admin",
        lastName: site.name,
        preferredLocale: "eu",
      },
    });

    const profesor = await prisma.user.upsert({
      where: { username: `profe.${emailSlug}` },
      update: {
        username: `profe.${emailSlug}`,
        email: null,
        firstName: "Irakasle",
        lastName: site.name,
        preferredLocale: "eu",
      },
      create: {
        username: `profe.${emailSlug}`,
        email: null,
        passwordHash: hash,
        firstName: "Irakasle",
        lastName: site.name,
        preferredLocale: "eu",
      },
    });

    const operador = await prisma.user.upsert({
      where: { username: `operador.${emailSlug}` },
      update: {
        username: `operador.${emailSlug}`,
        email: null,
        firstName: "Operador",
        lastName: site.name,
        preferredLocale: "eu",
      },
      create: {
        username: `operador.${emailSlug}`,
        email: null,
        passwordHash: hash,
        firstName: "Operador",
        lastName: site.name,
        preferredLocale: "eu",
      },
    });

    await prisma.userSiteRole.deleteMany({
      where: { userId: { in: [adminSede.id, profesor.id, operador.id] } },
    });

    await upsertRole({ userId: adminSede.id, roleId: adminSedeRole.id, siteId: site.id });
    await upsertRole({ userId: profesor.id, roleId: profesorSedeRole.id, siteId: site.id });
    await upsertRole({ userId: operador.id, roleId: operadorSedeRole.id, siteId: site.id });

    await prisma.teacherProfile.upsert({
      where: { userId: profesor.id },
      update: { siteId: site.id, notes: "Perfil inicial generado por seed" },
      create: {
        userId: profesor.id,
        siteId: site.id,
        notes: "Perfil inicial generado por seed",
      },
    });
  }

  return users;
}

async function createOperationalData(tutorUser) {
  const [azkoitia] = await prisma.site.findMany({ where: { code: "azkoitia" }, take: 1 });
  if (!azkoitia) {
    throw new Error("Azkoitia site not found.");
  }

  const family = await prisma.familyAccount.upsert({
    where: { id: "family_kodaore_demo" },
    update: {
      ownerId: tutorUser.id,
      email: "familia@kodaore.eus",
      phone: "600000001",
      preferredLocale: "eu",
      ibanMasked: "ES12 **** **** **** 1234",
      ibanEncrypted: "seed-placeholder",
    },
    create: {
      id: "family_kodaore_demo",
      ownerId: tutorUser.id,
      email: "familia@kodaore.eus",
      phone: "600000001",
      preferredLocale: "eu",
      ibanMasked: "ES12 **** **** **** 1234",
      ibanEncrypted: "seed-placeholder",
    },
  });

  const student = await prisma.student.upsert({
    where: { internalCode: "KOD-000001" },
    update: {
      familyAccountId: family.id,
      firstName: "June",
      lastName: "Garmendia",
      birthDate: new Date("2014-10-12"),
      schoolName: "Ikastola Azkoitia",
      schoolCourse: "6. maila",
      sportsCenterMemberCode: "P-10293",
      mainSiteId: azkoitia.id,
      isActive: true,
    },
    create: {
      internalCode: "KOD-000001",
      familyAccountId: family.id,
      firstName: "June",
      lastName: "Garmendia",
      birthDate: new Date("2014-10-12"),
      schoolName: "Ikastola Azkoitia",
      schoolCourse: "6. maila",
      sportsCenterMemberCode: "P-10293",
      mainSiteId: azkoitia.id,
      isActive: true,
    },
  });

  await prisma.studentTutor.upsert({
    where: {
      studentId_userId: {
        studentId: student.id,
        userId: tutorUser.id,
      },
    },
    update: {
      relation: "ama",
      isPrimary: true,
    },
    create: {
      studentId: student.id,
      userId: tutorUser.id,
      relation: "ama",
      isPrimary: true,
    },
  });

  const monthlyPlan = await prisma.tuitionPlan.upsert({
    where: { id: "plan_monthly_azkoitia" },
    update: {
      siteId: azkoitia.id,
      name: "Kuota hilekoa",
      period: BillingPeriod.MONTHLY,
      amountCents: 4500,
      isActive: true,
    },
    create: {
      id: "plan_monthly_azkoitia",
      siteId: azkoitia.id,
      name: "Kuota hilekoa",
      period: BillingPeriod.MONTHLY,
      amountCents: 4500,
      isActive: true,
    },
  });

  const enrollment = await prisma.enrollment.upsert({
    where: { id: "enrollment_demo_june" },
    update: {
      studentId: student.id,
      siteId: azkoitia.id,
      tuitionPlanId: monthlyPlan.id,
      startsAt: new Date("2025-09-01"),
      status: EnrollmentStatus.ACTIVE,
    },
    create: {
      id: "enrollment_demo_june",
      studentId: student.id,
      siteId: azkoitia.id,
      tuitionPlanId: monthlyPlan.id,
      startsAt: new Date("2025-09-01"),
      status: EnrollmentStatus.ACTIVE,
    },
  });

  const receipt = await prisma.receipt.upsert({
    where: { id: "receipt_demo_2026_03" },
    update: {
      siteId: azkoitia.id,
      studentId: student.id,
      enrollmentId: enrollment.id,
      periodStart: new Date("2026-03-01"),
      periodEnd: new Date("2026-03-31"),
      amountCents: 4500,
      dueDate: new Date("2026-03-05"),
      status: ReceiptStatus.PAID,
      ibanMasked: "ES12 **** **** **** 1234",
    },
    create: {
      id: "receipt_demo_2026_03",
      siteId: azkoitia.id,
      studentId: student.id,
      enrollmentId: enrollment.id,
      periodStart: new Date("2026-03-01"),
      periodEnd: new Date("2026-03-31"),
      amountCents: 4500,
      dueDate: new Date("2026-03-05"),
      status: ReceiptStatus.PAID,
      ibanMasked: "ES12 **** **** **** 1234",
    },
  });

  const remittance = await prisma.remittance.upsert({
    where: { id: "remittance_demo_2026_03" },
    update: {
      siteId: azkoitia.id,
      bankName: "Rural Kutxa",
      status: RemittanceStatus.CLOSED,
      totalCents: 4500,
    },
    create: {
      id: "remittance_demo_2026_03",
      siteId: azkoitia.id,
      bankName: "Rural Kutxa",
      status: RemittanceStatus.CLOSED,
      totalCents: 4500,
    },
  });

  await prisma.remittanceReceipt.upsert({
    where: {
      remittanceId_receiptId: {
        remittanceId: remittance.id,
        receiptId: receipt.id,
      },
    },
    update: {},
    create: {
      remittanceId: remittance.id,
      receiptId: receipt.id,
    },
  });

  await prisma.paymentMovement.upsert({
    where: { id: "movement_demo_2026_03_paid" },
    update: {
      receiptId: receipt.id,
      type: PaymentMovementType.COLLECTION,
      amountCents: 4500,
      note: "Cobro correcto en remesa marzo",
    },
    create: {
      id: "movement_demo_2026_03_paid",
      receiptId: receipt.id,
      type: PaymentMovementType.COLLECTION,
      amountCents: 4500,
      note: "Cobro correcto en remesa marzo",
    },
  });

  const leadTeacher = await prisma.teacherProfile.findFirst({ where: { siteId: azkoitia.id } });

  const group = await prisma.group.upsert({
    where: { id: "group_demo_azkoitia_kids" },
    update: {
      siteId: azkoitia.id,
      name: "Kids Asteartea",
      level: "Hasiberria",
      capacity: 18,
      isActive: true,
      leadTeacherId: leadTeacher?.id,
    },
    create: {
      id: "group_demo_azkoitia_kids",
      siteId: azkoitia.id,
      name: "Kids Asteartea",
      level: "Hasiberria",
      capacity: 18,
      isActive: true,
      leadTeacherId: leadTeacher?.id,
    },
  });

  const session = await prisma.classSession.upsert({
    where: { id: "session_demo_2026_03_31" },
    update: {
      groupId: group.id,
      startsAt: new Date("2026-03-31T17:00:00.000Z"),
      endsAt: new Date("2026-03-31T18:00:00.000Z"),
      room: "Sala 2",
      status: "closed",
    },
    create: {
      id: "session_demo_2026_03_31",
      groupId: group.id,
      startsAt: new Date("2026-03-31T17:00:00.000Z"),
      endsAt: new Date("2026-03-31T18:00:00.000Z"),
      room: "Sala 2",
      status: "closed",
    },
  });

  await prisma.attendance.upsert({
    where: {
      classSessionId_studentId: {
        classSessionId: session.id,
        studentId: student.id,
      },
    },
    update: {
      status: AttendanceStatus.PRESENT,
      note: "Asistentzia ondo",
    },
    create: {
      classSessionId: session.id,
      studentId: student.id,
      status: AttendanceStatus.PRESENT,
      note: "Asistentzia ondo",
    },
  });

  await prisma.communication.upsert({
    where: { id: "comm_demo_2026_03" },
    update: {
      siteId: azkoitia.id,
      type: CommunicationType.NOTICE,
      title: "Aste Santuko egutegia",
      content: "Aste Santuan ordutegi berezia izango dugu.\nXehetasunak administrazioan.",
      targetType: CommunicationTargetType.SITE,
      createdById: tutorUser.id,
    },
    create: {
      id: "comm_demo_2026_03",
      siteId: azkoitia.id,
      type: CommunicationType.NOTICE,
      title: "Aste Santuko egutegia",
      content: "Aste Santuan ordutegi berezia izango dugu.\nXehetasunak administrazioan.",
      targetType: CommunicationTargetType.SITE,
      createdById: tutorUser.id,
    },
  });

  await prisma.auditLog.upsert({
    where: { id: "audit_demo_seed" },
    update: {
      actorUserId: tutorUser.id,
      siteId: azkoitia.id,
      entity: "receipt",
      entityId: receipt.id,
      action: "seed.create_or_update",
      afterData: { receiptId: receipt.id, status: receipt.status },
      ipAddress: "127.0.0.1",
    },
    create: {
      id: "audit_demo_seed",
      actorUserId: tutorUser.id,
      siteId: azkoitia.id,
      entity: "receipt",
      entityId: receipt.id,
      action: "seed.create_or_update",
      afterData: { receiptId: receipt.id, status: receipt.status },
      ipAddress: "127.0.0.1",
    },
  });

  await prisma.excelImport.upsert({
    where: { id: "import_demo_seed" },
    update: {
      type: ImportType.STUDENTS,
      fileName: "alumnos_inicial.xlsx",
      status: ImportStatus.COMPLETED,
      summary: { inserted: 1, updated: 0, errors: 0 },
      createdById: tutorUser.id,
    },
    create: {
      id: "import_demo_seed",
      type: ImportType.STUDENTS,
      fileName: "alumnos_inicial.xlsx",
      status: ImportStatus.COMPLETED,
      summary: { inserted: 1, updated: 0, errors: 0 },
      createdById: tutorUser.id,
    },
  });
}

async function createTeacherTags() {
  const tagBySite = ["koordinatzailea", "haurrak", "ordezkapenak"];
  const sites = await prisma.site.findMany();
  for (const site of sites) {
    for (const tagName of tagBySite) {
      await prisma.teacherTag.upsert({
        where: {
          siteId_name: {
            siteId: site.id,
            name: tagName,
          },
        },
        update: {},
        create: {
          siteId: site.id,
          name: tagName,
        },
      });
    }
  }
}

async function main() {
  await createRolesAndPermissions();
  await createSites();
  const users = await createUsersAndAssignments();
  await createTeacherTags();
  await createOperationalData(users.tutor);

  console.log("Kodaore seed completed");
  console.log(`Default seed password: ${defaultPassword}`);
  console.log("Developer user (username): developer");
  console.log("Global admin user (username): admin.global");
  console.log("Family user (email): familia@kodaore.eus");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
