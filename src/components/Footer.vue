<template>
    <footer>
        <v-container>
            <v-row>
                <v-col md="3" cols="12" class="mb-8" :align="isSMandDown ? 'center' : ''">
                    <h3 class="widget_area_title mb-3">Related Links</h3>
                    <ul class="footer_link_list" v-if="related_links">
                        <li v-for="link in related_links" :key="link.title">
                            <a :href="link.link">{{ link.title }}</a>
                        </li>
                    </ul>
                    <v-btn class="mt-4" color="primary">Donate to the CSMNH</v-btn>
                </v-col>
                <v-col md="6" cols="12" class="mb-8" align="center">
                    <v-img
                        max-width="300"
                        lazy
                        src="@/assets/images/csmnh_logo.png"
                    />
                </v-col>
                <v-col md="3" cols="12" class="mb-8" :align="isSMandDown ? 'center' : ''">
                    <h3 class="widget_area_title mb-3">Contact Us</h3>
                    <p>
                        Connecticut State Museum of Natural History<br>
                        University of Connecticut, Unit 3023<br>
                        75 N. Eagleville Rd.<br>
                        Storrs, CT 06269-3023
                    </p>
                    <p>
                        Phone: 860-486-4460 Fax: 860-486-0827<br>
                        <a href="mailto:CSMNHinfo@uconn.edu">CSMNHinfo@uconn.edu</a>
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </footer>
</template>

<script>
export default {
    data: () => {
        return {
            related_links: [{
                title: 'University of Connecticut',
                link: 'https://uconn.edu/'
            }, {
                title: 'Office of State Archaeology',
                link: 'https://osa.uconn.edu/'
            }, {
                title: 'Biodiversity Research Collections',
                link: 'https://biodiversity.uconn.edu/'
            }]
        }
    },
    computed: {
        isSMandDown() {
            return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
        }
    }
}
</script>

<style scoped>
.widget_area_title {
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 16px;
}

footer {
    padding: 77px 20px;
    border-top: 2px solid #E5E5E5;
}

.footer_link_list {
    list-style-type: none;
    font-size: 16px;
    margin: 0;
    padding: 0;
}

.footer_link_list li {
    margin-bottom: 12px;
    font-family: 'Open Sans', sans-serif;
}

.footer_link_list li a {
    line-height: 25px;
    font-size: 16px;
    color: #323944;
    text-decoration: none;
    padding-top: 4px;
    padding-bottom: 4px;
}
</style>