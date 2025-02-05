import Progress, { IProgress } from "../models/progressModel";
import Lecture from '../../lectures/models/lectureModel'
import { IProgressRepository } from "./IProgressRepository";

export class ProgressRepository implements IProgressRepository {
    


    async findProgress(userId: string , courseId: string, ): Promise<IProgress | null> {
        return await Progress.findOne({userId, courseId})
    }

    async markLectureCompleted(userId:string, courseId: string, lectureId: string): Promise<IProgress | null> {
        return await Progress.findOneAndUpdate(
            {userId, courseId},
            {
                $addToSet : {completedLecturesDetails: lectureId},
                $inc : {lecturesCompleted: 1}
            },
            {new: true}
        )
    }

    async updateProgressPercentage(userId: string, courseId: string, progressPercentage: number, completed: boolean): Promise<IProgress | null> {
        return await Progress.findOneAndUpdate(
            {userId, courseId},
            {progressPercentage, completed, completionDate: completed ? new Date() : null},
            {new: true}
        )
    }

    async updateCertificateUrl(userId: string, courseId: string, certificateUrl: string): Promise<IProgress | null> {
        return await Progress.findOneAndUpdate(
            { userId, courseId },
            { certificateUrl },
            { new: true }
        );
    }

}