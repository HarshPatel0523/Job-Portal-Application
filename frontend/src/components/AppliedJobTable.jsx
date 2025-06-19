// @ts-nocheck
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const allAppliedJobs = useSelector(store => Array.isArray(store.job.appliedJobs) ? store.job.appliedJobs : []);

    const noJobs = allAppliedJobs.length <= 0;

    return (
        <div>
            {
                noJobs ? (
                    <p className="text-center text-gray-500 mt-4">You haven't applied for any job yet.</p>
                ) : (
                    <Table className={undefined}>
                        <TableCaption className={undefined}>A list of your applied jobs</TableCaption>
                        <TableHeader className={undefined}>
                            <TableRow className={undefined}>
                                <TableHead className={undefined}>Date</TableHead>
                                <TableHead className={undefined}>Job Role</TableHead>
                                <TableHead className={undefined}>Company</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className={undefined}>
                            {allAppliedJobs.map((appliedJob) => (
                                <TableRow key={appliedJob._id} className={undefined}>
                                    <TableCell className={undefined}>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell className={undefined}>{appliedJob.job?.title}</TableCell>
                                    <TableCell className={undefined}>{appliedJob.job?.company?.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            className={appliedJob?.status === "rejected"
                                                ? 'bg-red-400'
                                                : appliedJob.status === 'pending'
                                                    ? 'bg-gray-400'
                                                    : 'bg-green-400'} variant={undefined}                                        >
                                            {appliedJob.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
            }
        </div>
    )
}

export default AppliedJobTable
