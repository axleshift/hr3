@php
    $modules = [
        [
            'name' => 'ADMIN',
            'description' => 'Provides comprehensive user access and authentication features. It allows administrators to define and assign roles, manage password resets, and recover critical data. This module ensures secure and efficient user management for your organization.',
            'url' => 'https://admin.axleshift.com',
        ],
        [
            'name' => 'CORE 1',
            'description' => 'Streamlines order management, planning, and scheduling processes. It enhances customer support with real-time notifications, ensuring seamless communication. This module is essential for optimizing operational workflows.',
            'url' => 'https://core1.axleshift.com/login',
        ],
        [
            'name' => 'CORE 2',
            'description' => 'Real-time tracking capabilities to monitor operations effectively. It provides accurate and up-to-date information, enabling better decision-making and operational efficiency.',
            'url' => 'https://core2.axleshift.com',
        ],
        [
            'name' => 'FINANCE',
            'description' => 'Simplifies financial management for your organization. It provides tools for tracking expenses, managing budgets, and generating financial reports. This module ensures transparency and accuracy in financial operations.',
            'url' => 'https://finance.axleshift.com/login',
        ],
        [
            'name' => 'HR 1',
            'description' => 'Managing employee records and attendance tracking. It also handles employee offboarding, HR analytics, and reporting. This module is designed to streamline human resource operations efficiently.',
            'url' => 'https://hr1.axleshift.com/login',
        ],
        [
            'name' => 'HR 2',
            'description' => 'Facilitates new hire documentation and onboarding processes. It supports job posting, recruitment, and application management, making it an essential tool for talent acquisition teams.',
            'url' => 'https://hr2.axleshift.com/login',
        ],
        [
            'name' => 'HR 3',
            'description' => 'Handles payroll, benefits, and compliance management. It also manages leave requests, ensuring smooth and accurate employee compensation processes.',
            'url' => 'https://hr3.axleshift.com/login',
        ],
        [
            'name' => 'HR 4',
            'description' => 'Focuses on employee training and development. It provides tools for managing training budgets, generating reports, and overseeing talent and learning management programs.',
            'url' => 'https://hr4.axleshift.com/login',
        ],
        [
            'name' => 'LOG 1',
            'description' => 'Designed for vehicle and driver management. It optimizes load planning, fuel management, and overall logistics operations, ensuring efficient resource utilization.',
            'url' => 'https://log1.axleshift.com/login',
        ],
        [
            'name' => 'LOG 2',
            'description' => 'Streamlines document tracking and warehouse inventory management. It also provides a vendor portal for better collaboration and operational efficiency.',
            'url' => 'https://log2.axleshift.com/',
        ],
    ];
@endphp

<div class="h-100">
    <div class="container pt-5">
        <div class="mb-2" data-aos="fade-down">
            <span>MODULES</span>
            <h2 class="text-primary">
                Without them, there's no axleshift!
            </h2>
        </div>
        <div class="row">
            @foreach ($modules as $module)
                <div class="col-sm-4">
                    <div class="card mb-4 border-0 rounded-0 module-card" data-aos="fade-up" style="transition: transform 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <div class="card-body">
                            <h5 class="card-title" data-aos="fade-up" data-aos-delay="500">
                                {{ $module['name'] }}
                            </h5>
                            <p class="card-text text-muted" data-aos="fade-up" data-aos-delay="800">
                                {{ $module['description'] }}
                            </p>
                            <div class="d-flex justify-content-end">
                                <a href="{{ $module['url'] }}" class="btn rounded-pill bg-primary bg-opacity-25 text-primary"
                                    data-aos="fade-right" data-aos-delay="1000">
                                    <i class="fas fa-chevron-right p-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>
