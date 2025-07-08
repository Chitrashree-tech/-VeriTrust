document.addEventListener('DOMContentLoaded', function() {
    // Simulate fraud detection when placing order
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const fraudAlert = document.querySelector('.fraud-alert');
    
    if (placeOrderBtn && fraudAlert) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Random chance to show fraud alert (for demo)
            if (Math.random() > 0.5) {
                fraudAlert.classList.add('visible');
                
                // Scroll to alert
                fraudAlert.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Proceed with normal checkout
                alert('Order placed successfully!');
                // In real app, would submit form here
            }
        });
    }
    
    // Update fraud indicators based on form inputs
    const form = document.getElementById('shippingForm');
    if (form) {
        form.addEventListener('input', function() {
            // In a real app, this would analyze form data
            // For demo, we'll just randomly update indicators
            
            const indicators = document.querySelectorAll('.indicator .status');
            indicators.forEach(indicator => {
                // 30% chance to change status
                if (Math.random() > 0.7) {
                    const statuses = ['safe', 'warning', 'danger'];
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    
                    // Remove all status classes
                    indicator.classList.remove('safe', 'warning', 'danger');
                    // Add new status
                    indicator.classList.add(newStatus);
                    
                    // Update text
                    if (newStatus === 'safe') indicator.textContent = 'Normal';
                    if (newStatus === 'warning') indicator.textContent = 'Unusual';
                    if (newStatus === 'danger') indicator.textContent = 'Risky';
                }
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shippingForm');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const fraudAlert = document.querySelector('.fraud-alert');
    const indicators = document.querySelectorAll('.indicator .status');
    
    // Simulate fraud analysis based on form inputs
    form.addEventListener('input', debounce(() => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Mock fraud analysis
        const riskFactors = {
            newAccount: Math.random() > 0.7,
            highValue: appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 500,
            fastCheckout: true, // Assuming this is a quick checkout
            mismatchedLocation: data.city && data.city.toLowerCase().includes('ny') && !data.zip.startsWith('1')
        };
        
        // Update indicators
        indicators[0].textContent = riskFactors.newAccount ? 'Risky' : 'Normal';
        indicators[0].className = `status ${riskFactors.newAccount ? 'danger' : 'safe'}`;
        
        indicators[1].textContent = riskFactors.mismatchedLocation ? 'Mismatch' : 'Normal';
        indicators[1].className = `status ${riskFactors.mismatchedLocation ? 'danger' : 'safe'}`;
        
        indicators[2].textContent = riskFactors.highValue ? 'High Value' : 'Normal';
        indicators[2].className = `status ${riskFactors.highValue ? 'warning' : 'safe'}`;
        
    }, 500));
    
    // Place order with fraud check
    placeOrderBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Show loading state
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing';
        
        // Simulate API call to fraud detection
        const isFraudulent = await checkForFraud();
        
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Your Order';
        
        if (isFraudulent) {
            fraudAlert.classList.add('visible');
            fraudAlert.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Proceed with successful order
            window.location.href = 'order-confirmation.html';
        }
    });
    
    // Mock fraud detection function
    async function checkForFraud() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 30% chance of fraud for demo
        return Math.random() < 0.3;
    }
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
});
// Fraud detection rules and scoring
const FraudDetection = {
    // Risk factors with base scores
    riskFactors: {
        ipChange: 1,
        newDevice: 1,
        oddTime: 0.5,
        cartDeviation: {
            threshold: 3, // 3x normal cart value
            score: 1
        },
        failedOTPs: {
            threshold: 3,
            score: 2
        },
        vpnUsage: 0.5,
        firstTimeHighValue: 1,
        disposableEmail: 2,
        addressChange: 1
    },
    
    // Known disposable email domains
    disposableDomains: [
        'mailinator.com', 
        '10minutemail.com',
        'tempmail.com',
        'guerrillamail.com',
        'maildrop.cc',
        'trashmail.com'
    ],
    
    // Normal shopping hours (9AM-9PM)
    normalHours: [9, 21],
    
    // User's typical behavior profile
    userProfile: {
        typicalCartValue: 5000, // ₹5000 average order
        typicalLocation: 'Mumbai',
        devices: ['device123'],
        paymentMethods: ['card789']
    },
    
    // Current transaction data
    currentTransaction: {},
    
    // Initialize with current transaction data
    init(transactionData) {
        this.currentTransaction = transactionData;
        this.userProfile = transactionData.userProfile || this.userProfile;
        return this;
    },
    
    // Calculate fraud score
    calculateScore() {
        let score = 0;
        const reasons = [];
        
        // 1. IP Address Change
        if (this.currentTransaction.ipChange) {
            score += this.riskFactors.ipChange;
            reasons.push('IP address changed from usual location');
        }
        
        // 2. New Device
        if (this.currentTransaction.newDevice && 
            !this.userProfile.devices.includes(this.currentTransaction.deviceId)) {
            score += this.riskFactors.newDevice;
            reasons.push('Login from new device');
        }
        
        // 3. Odd Time of Transaction
        const hour = new Date().getHours();
        if (hour < this.normalHours[0] || hour > this.normalHours[1]) {
            score += this.riskFactors.oddTime;
            reasons.push('Transaction during non-typical hours');
        }
        
        // 4. Unusual Cart Value
        const cartDeviation = this.currentTransaction.cartValue / this.userProfile.typicalCartValue;
        if (cartDeviation > this.riskFactors.cartDeviation.threshold) {
            score += this.riskFactors.cartDeviation.score;
            reasons.push(`Cart value ${cartDeviation.toFixed(1)}x higher than usual`);
        }
        
        // 5. Multiple Failed OTPs
        if (this.currentTransaction.failedOTPs >= this.riskFactors.failedOTPs.threshold) {
            score += this.riskFactors.failedOTPs.score;
            reasons.push(`${this.currentTransaction.failedOTPs} failed OTP attempts`);
        }
        
        // 6. VPN Use
        if (this.currentTransaction.vpnUsage) {
            score += this.riskFactors.vpnUsage;
            reasons.push('VPN detected');
        }
        
        // 7. First-Time High Value Purchase
        if (this.currentTransaction.firstPurchase && 
            cartDeviation > this.riskFactors.cartDeviation.threshold) {
            score += this.riskFactors.firstTimeHighValue;
            reasons.push('First purchase with high value');
        }
        
        // 8. Disposable Email Check
        const emailDomain = this.currentTransaction.email.split('@')[1];
        if (this.disposableDomains.includes(emailDomain)) {
            score += this.riskFactors.disposableEmail;
            reasons.push('Disposable email detected');
        }
        
        // 9. Shipping Address Changed
        if (this.currentTransaction.addressChange && 
            this.currentTransaction.shippingAddress !== this.userProfile.typicalLocation) {
            score += this.riskFactors.addressChange;
            reasons.push('Shipping address changed from usual location');
        }
        
        return {
            score: Math.min(10, score), // Cap at 10
            reasons,
            riskLevel: this.getRiskLevel(score)
        };
    },
    
    getRiskLevel(score) {
        if (score >= 5) return 'High';
        if (score >= 3) return 'Medium';
        return 'Low';
    },
    
    // Decision making with thresholds
    shouldFlagTransaction() {
        const analysis = this.calculateScore();
        
        // High risk scenarios that should be blocked
        if (analysis.score >= 7) {
            return {
                decision: 'block',
                ...analysis
            };
        }
        
        // Medium risk scenarios that need verification
        if (analysis.score >= 4) {
            return {
                decision: 'verify',
                ...analysis
            };
        }
        
        // Low risk - allow
        return {
            decision: 'allow',
            ...analysis
        };
    }
};

// Integration with checkout page
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shippingForm');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const fraudAlert = document.querySelector('.fraud-alert');
    const fraudReasons = document.querySelector('.fraud-reasons');
    
    // Current transaction data (would come from your actual form)
    const currentTransaction = {
        ipChange: true,
        newDevice: true,
        deviceId: 'device456',
        cartValue: 25000, // ₹25,000
        failedOTPs: 2,
        vpnUsage: true,
        firstPurchase: false,
        email: 'user@gmail.com',
        addressChange: true,
        shippingAddress: 'Delhi',
        userProfile: {
            typicalCartValue: 5000,
            typicalLocation: 'Mumbai',
            devices: ['device123'],
            paymentMethods: ['card789']
        }
    };
    
    // Initialize fraud detection
    const fraudDetection = Object.create(FraudDetection).init(currentTransaction);
    
    // Run fraud check when form changes
    form.addEventListener('input', debounce(() => {
        updateFraudIndicators();
    }, 500));
    
    // Place order with fraud check
    placeOrderBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Show loading state
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing';
        
        // Get fraud analysis
        const fraudAnalysis = fraudDetection.shouldFlagTransaction();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Your Order';
        
        // Handle based on fraud decision
        if (fraudAnalysis.decision === 'block') {
            showFraudAlert(fraudAnalysis);
        } else if (fraudAnalysis.decision === 'verify') {
            showVerificationRequired(fraudAnalysis);
        } else {
            // Proceed with successful order
            window.location.href = 'order-confirmation.html';
        }
    });
    
    // Update UI indicators based on fraud analysis
    function updateFraudIndicators() {
        const analysis = fraudDetection.calculateScore();
        
        // Update risk score display
        document.querySelector('.risk-score').textContent = analysis.score;
        document.querySelector('.risk-level').textContent = analysis.riskLevel;
        document.querySelector('.risk-level').className = `risk-level ${analysis.riskLevel.toLowerCase()}`;
        
        // Update individual indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach(indicator => {
            const factor = indicator.dataset.factor;
            let status = 'safe';
            let message = 'Normal';
            
            switch(factor) {
                case 'ip':
                    status = currentTransaction.ipChange ? 'warning' : 'safe';
                    message = currentTransaction.ipChange ? 'Changed' : 'Normal';
                    break;
                case 'device':
                    status = currentTransaction.newDevice ? 'warning' : 'safe';
                    message = currentTransaction.newDevice ? 'New device' : 'Known device';
                    break;
                case 'time':
                    const hour = new Date().getHours();
                    status = (hour < 9 || hour > 21) ? 'warning' : 'safe';
                    message = (hour < 9 || hour > 21) ? 'Odd time' : 'Normal hours';
                    break;
                case 'cart':
                    const deviation = currentTransaction.cartValue / currentTransaction.userProfile.typicalCartValue;
                    status = deviation > 3 ? 'danger' : (deviation > 2 ? 'warning' : 'safe');
                    message = deviation > 3 ? 'High value' : (deviation > 2 ? 'Elevated' : 'Normal');
                    break;
            }
            
            indicator.querySelector('.status').textContent = message;
            indicator.querySelector('.status').className = `status ${status}`;
        });
    }
    
    function showFraudAlert(analysis) {
        fraudReasons.innerHTML = analysis.reasons.map(reason => 
            `<li><i class="fas fa-exclamation-circle"></i> ${reason}</li>`
        ).join('');
        
        fraudAlert.classList.add('visible', 'block');
        fraudAlert.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showVerificationRequired(analysis) {
        fraudReasons.innerHTML = analysis.reasons.map(reason => 
            `<li><i class="fas fa-question-circle"></i> ${reason}</li>`
        ).join('');
        
        fraudAlert.classList.add('visible', 'verify');
        document.querySelector('.alert-actions').innerHTML = `
            <button class="btn secondary" id="cancelOrder">Cancel Order</button>
            <button class="btn primary" id="verifyIdentity">Verify Identity</button>
        `;
        
        document.getElementById('verifyIdentity').addEventListener('click', () => {
            // In real app, would initiate verification flow
            alert('Verification flow would start here (OTP, email confirmation, etc.)');
        });
        
        fraudAlert.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Initial update
    updateFraudIndicators();
});