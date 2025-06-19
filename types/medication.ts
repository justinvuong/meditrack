export type Medication = {
    user_id: string,
    id: string;
    name: string;
    dosage: string;
    scheduled_time: string;
    start_date: string;
    end_date: string;
    repeat_day: string;
    taken: boolean
};

//dto for creating new medication (from the add form)
export type CreateMedicationDTO = Omit<Medication, 'id'>; 

//DTO for updating a medication 
export type UPdateMedicationDTO = Partial<CreateMedicationDTO>;