const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const Pro = require('pro.db');
const { owners, prefix } = require(`${process.cwd()}/config`);
let grantedPermissions = {}; // تعريف المتغير كمتغير عالمي

module.exports = {
    name: 'سماح',
    aliases: ['allow'],
    description: 'يمكن هذا الأمر للمالكين فقط، ويسمح بإضافة صلاحيات لدور أو عضو محدد.',
    run: async function(client, message) {

        if (!owners.includes(message.author.id)) return message.react('❌');
        const isEnabled = Pro.get(`command_enabled_${module.exports.name}`);
        if (isEnabled === false) {
            return; 
        }


        const Color = Pro.get(`Guild_Color = ${message.guild.id}`) || '#a7a9a9';
        if (!Color) return;


        const Args = message.content.split(' ');

        if (!Args[1]) {
            const Embed = new MessageEmbed()
                .setColor(Color)
                .setDescription(`**يرجى استخدام الأمر بالطريقة الصحيحة .**\n${prefix}allow <@${message.author.id}>`);

            return message.reply({ embeds: [Embed] });
        }

        const Roles = message.guild.roles.cache.get(Args[2]) || message.mentions.roles.first();
        const Member = message.guild.members.cache.get(Args[2]) || message.mentions.members.first();

        if (!Roles && !Member) {
            const embed = new MessageEmbed()
                .setColor(Color)
                .setDescription('**يرجى ارفاق منشن صحيح للرول أو العضو.**');

            return message.reply({ embeds: [embed] });
        }

        const permissions = [
            { name: 'حظر وفك', value: 'ban', emoji: '1259143163323351050' },
            { name: 'الطرد', value: 'kick', emoji: '1259143163323351050' },
            { name: 'السجن', value: 'prison', emoji: '1259143163323351050' },
            { name: 'الأسكاتي الكتابي', value: 'mute', emoji: '1259143163323351050' },
            { name: 'الميوت الصوتي', value: 'vmute', emoji: '1259143163323351050' },
            { name: 'اعطاء إزالة رول', value: 'role', emoji: '1259143163323351050' },
            { name: 'اعطاء إزالة إنشاء, رول للجميع', value: 'allrole', emoji: '1259143163323351050' },
            { name: 'الرولات الخاصة', value: 'srole', emoji: '1259143163323351050' },
            { name: 'المسح', value: 'clear', emoji: '1259143163323351050' },
            { name: 'الصور ،الهير ،الكام', value: 'pic', emoji: '1259143163323351050' },
            { name: 'سحب ،ودني', value: 'move', emoji: '1259143163323351050' },
            { name: 'قفل فتح', value: 'lock', emoji: '1259143163323351050' },
            { name: 'اخفاء اظهار', value: 'hide', emoji: '1259143163323351050' },
            { name: 'معلومات الرول', value: 'check', emoji: '1259143163323351050' },
            { name: 'اوامر الانذارات', value: 'warn', emoji: '1259143163323351050' },
            { name: 'إزالة إضافة الكنية', value: 'setnick', emoji: '1259143163323351050' },



        ];

        const selectMenu = new MessageSelectMenu()
            .setCustomId('permissionSelect')
            .setPlaceholder('يرجى أختيار الصلاحيات المُراد إضافتها')
            .setMinValues(1) 
            .setMaxValues(permissions.length) 
            .addOptions(
                permissions.map(permission => ({
                    label: permission.name,
                    value: permission.value,
                    emoji: permission.emoji
                }))
            );

        const row = new MessageActionRow().addComponents(selectMenu);

        const ddeleteButton = new MessageButton()
            .setCustomId('ItsCancel')
            .setLabel('إلغاء')
            .setStyle('DANGER');

        const ItsCancel = new MessageActionRow()
            .addComponents(ddeleteButton);

        const embed = new MessageEmbed()
            .setColor(Color)
            .setTitle("يرجى تحديد الامر .")
            .setFooter(client.user.username, client.user.displayAvatarURL());
            
        const menuMessage = await message.reply({
            embeds: [embed],
            components: [row, ItsCancel]
        });

        const filter = interaction => interaction.user.id === message.author.id && interaction.customId === 'permissionSelect';
        const collector = menuMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            const chosenPermissions = interaction.values;
            const roleId = Roles ? Roles.id : Member.id; 
            
            if (!grantedPermissions[roleId]) {
                grantedPermissions[roleId] = [];
            }
        
            for (const permission of chosenPermissions) {
                if (!grantedPermissions[roleId].includes(permission)) {
                    const permissionKey = `Allow - Command ${permission} = [ ${message.guild.id} ]`;
                    const existingPermission = Pro.get(permissionKey); 
            
                    if (!existingPermission || existingPermission === message.guild.id) {
                        Pro.set(permissionKey, roleId);
            
                        const permissionName = permissions.find(p => p.value === permission).name;
                        grantedPermissions[roleId].push(permission);
                    }
                }
            }
            
            let mention = Roles ? `<@&${Roles.id}>` : `<@${Member.id}>`;

            const permissionsEmbed = new MessageEmbed()
                .setColor(Color)
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setTitle("إستخدام ناجح ✅")
                .setDescription(`\`صلاحيات\` **${mention}** \`الآن\` :\n\n${grantedPermissions[roleId].map(p => `**✅ | ${permissions.find(permission => permission.value === p).name}**`).join('\n')}`);
        
            await menuMessage.edit({ embeds: [permissionsEmbed], components: [] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                menuMessage.edit('لم يتم اختيار الصلاحيات، حاول مرة أخرى.', { components: [] });
            }
        });
        
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;
        
            if (interaction.customId === 'ItsCancel') {
                const message = interaction.message;
                if (message && !message.deleted) {
                    collector.stop();
                    message.delete();
                }
            }
        });        
    }
};
