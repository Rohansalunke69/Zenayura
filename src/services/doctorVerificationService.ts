import { prisma } from '@/lib/prisma';

export const VERIFICATION_STATUS = {
    PENDING: 'PENDING',
    AUTO_APPROVED: 'AUTO_APPROVED',
    AUTO_REJECTED: 'AUTO_REJECTED',
    MANUAL_REVIEW: 'MANUAL_REVIEW',
    ADMIN_APPROVED: 'ADMIN_APPROVED',
} as const;

export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

export interface VerificationResult {
    status: VerificationStatus;
    score: number;
    reasons: string[];
}

export async function verifyDoctorApplication(data: any, userId: string): Promise<VerificationResult> {
    let score = 100;
    const reasons: string[] = [];

    // Step 1: Basic Data Validation
    const requiredFields = ['name', 'specialty', 'experience', 'licenseNumber', 'registrationNumber'];
    const missingFields = requiredFields.filter(f => data[f] === undefined || data[f] === null || data[f] === '');

    // check location or clinicAddress
    if (!data.location && !data.clinicAddress) {
        missingFields.push('location/clinicAddress');
    }

    if (missingFields.length > 0) {
        score -= 20;
        reasons.push(`Missing basic information: ${missingFields.join(', ')}`);
    }

    // Step 2: License Format Validation
    // Simple alphanumeric with hyphens, at least 5 chars.
    const licenseRegex = /^[A-Za-z0-9-]{5,}$/;
    if (data.licenseNumber && !licenseRegex.test(data.licenseNumber)) {
        score -= 20;
        reasons.push('Invalid license number format');
    }

    if (data.registrationNumber && !licenseRegex.test(data.registrationNumber)) {
        score -= 20;
        reasons.push('Invalid registration number format');
    }

    // Step 3: Duplicate Check
    let hasDuplicate = false;
    if (data.licenseNumber || data.registrationNumber) {
        const duplicateDoctor = await prisma.doctor.findFirst({
            where: {
                OR: [
                    data.licenseNumber ? { licenseNumber: data.licenseNumber } : {},
                    data.registrationNumber ? { registrationNumber: data.registrationNumber } : {}
                ].filter(condition => Object.keys(condition).length > 0),
                NOT: {
                    userId: userId // Exclude the current applying user
                }
            }
        });

        if (duplicateDoctor) {
            hasDuplicate = true;
            score -= 40;
            reasons.push('Duplicate license or registration number found in system');
        }
    }

    // Step 4: Document Verification (Basic presence check)
    if (!data.degreeCertificate || !data.governmentId || !data.licenseDocument) {
        score -= 40;
        const missingDocs = [];
        if (!data.degreeCertificate) missingDocs.push('degreeCertificate');
        if (!data.governmentId) missingDocs.push('governmentId');
        if (!data.licenseDocument) missingDocs.push('licenseDocument');
        reasons.push(`Missing required documents: ${missingDocs.join(', ')}`);
    }

    // Step 5: Scoring and Status
    let status: VerificationStatus = VERIFICATION_STATUS.PENDING;

    if (score >= 90) {
        status = VERIFICATION_STATUS.AUTO_APPROVED;
    } else if (score >= 60) {
        status = VERIFICATION_STATUS.MANUAL_REVIEW;
    } else {
        status = VERIFICATION_STATUS.AUTO_REJECTED;
    }

    if (score < 100 && reasons.length === 0) {
        reasons.push('General review required');
    }

    return {
        status,
        score,
        reasons
    };
}
