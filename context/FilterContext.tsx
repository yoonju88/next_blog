import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
    status: string;
    setStatus: (value: string) => void;
    paymentStatus: string;
    setPaymentStatus: (value: string) => void;
    user: string;
    setUser: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState('all');
    const [paymentStatus, setPaymentStatus] = useState('all');
    const [user, setUser] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    return (
        <FilterContext.Provider value={{
            status,
            setStatus,
            paymentStatus,
            setPaymentStatus,
            user,
            setUser,
            startDate,
            setStartDate,
            endDate,
            setEndDate
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context
}