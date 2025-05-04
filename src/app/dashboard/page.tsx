import { requestInfo } from '@redwoodjs/sdk/worker';
import Dashboard from './Dashboard';
import ShellLayout from '../layout/ShellLayout';

export default function DashboardPage() {
    return (
        <div>
            <ShellLayout user={requestInfo.ctx.user!}>
                <Dashboard />
            </ShellLayout>
        </div>
    );
}
