'use client'
import {motion} from 'framer-motion';
import React, {useEffect, useState} from 'react'
import MarkdownCard from "@/components/markdown-card";

const ExampleUsage = () => {
    const [markdownContent, setMarkdownContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileUrl = '/compliance/terms-and-conditions.md';

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch markdown: ${response.statusText}`);
                }
                const text = await response.text();
                setMarkdownContent(text);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (fileUrl) {
            fetchMarkdown();
        }
    }, [fileUrl]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <motion.div
                    animate={{rotate: 360}}
                    transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                    className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-100 rounded-lg">
                Error loading markdown: {error}
            </div>
        );
    }

    return <MarkdownCard content={markdownContent}/>;
};

export default ExampleUsage;